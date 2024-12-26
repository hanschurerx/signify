import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 确保 JWT_SECRET 一定有值
const JWT_SECRET = process.env.JWT_SECRET || "signify-jwt-secret-key-2024";

export async function POST(request: Request) {
  try {
    // 验证请求体是否存在
    if (!request.body) {
      return NextResponse.json({ error: "请求体不能为空" }, { status: 400 });
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ error: "无效的 JSON 格式" }, { status: 400 });
    }

    const { email, username, phone, password } = body;

    // 验证必填字段
    if (!email || !username || !phone || !password) {
      return NextResponse.json(
        { error: "请填写所有必填字段" },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "邮箱格式不正确" }, { status: 400 });
    }

    // 验证手机号格式（美国）
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json({ error: "手机号格式不正确" }, { status: 400 });
    }

    // 验证用户名长度
    if (username.length < 2 || username.length > 20) {
      return NextResponse.json(
        { error: "用户名长度应在2-20个字符之间" },
        { status: 400 }
      );
    }

    // 验证密码长度
    if (password.length < 6) {
      return NextResponse.json(
        { error: "密码长度不能少于6个字符" },
        { status: 400 }
      );
    }

    // 验证邮箱是否已存在
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail) {
      return NextResponse.json({ error: "该邮箱已被注册" }, { status: 400 });
    }

    // 验证用户名是否已存在
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUsername) {
      return NextResponse.json({ error: "该用户名已被使用" }, { status: 400 });
    }

    // 验证手机号是否已存在
    const existingPhone = await prisma.user.findUnique({
      where: { phone },
    });
    if (existingPhone) {
      return NextResponse.json({ error: "该手机号已被注册" }, { status: 400 });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await prisma.user.create({
      data: {
        email,
        username,
        phone,
        password: hashedPassword,
      },
    });

    if (!user || !user.id) {
      return NextResponse.json({ error: "用户创建失败" }, { status: 500 });
    }

    try {
      // 生成 token
      const payload = {
        userId: user.id,
        email: user.email,
        username: user.username,
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

      // 返回用户信息（不包含密码）
      const { password: _, ...userWithoutPassword } = user;

      return NextResponse.json(
        {
          message: "注册成功",
          token,
          user: userWithoutPassword,
        },
        { status: 201 }
      );
    } catch (tokenError) {
      console.error("Token generation error:", tokenError);
      // 用户已创建，但token生成失败
      return NextResponse.json(
        { error: "用户创建成功，但登录token生成失败" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("注册错误:", error);
    return NextResponse.json(
      { error: "注册失败，请稍后重试" },
      { status: 500 }
    );
  }
}
