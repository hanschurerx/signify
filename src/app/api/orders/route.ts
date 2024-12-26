import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "signify-jwt-secret-key-2024";

// 验证 token 的函数
async function verifyToken(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    console.log("Auth header:", authHeader); // 检查 auth header

    if (!authHeader?.startsWith("Bearer ")) {
      console.log("No Bearer token found");
      return null;
    }

    const token = authHeader.substring(7);
    console.log("Token:", token); // 检查 token

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded token:", decoded); // 检查解码后的 token

    if (!decoded || typeof decoded !== "object" || !("userId" in decoded)) {
      console.log("Invalid token payload");
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: (decoded as { userId: string }).userId },
    });
    console.log("Found user:", user); // 检查找到的用户

    return user;
  } catch (error) {
    console.error("Token verification error:", error); // 检查具体错误
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return new NextResponse(null, { status: 401 });
    }

    const body = await request.json();
    const { mediaTypeId, customization, totalAmount } = body;

    // 查找产品
    const product = await prisma.product.findFirst({
      where: {
        mediaType: mediaTypeId,
        status: "active",
      },
    });

    if (!product) {
      return new NextResponse(null, { status: 404 });
    }

    // 创建订单
    const order = await prisma.$transaction(async (prisma) => {
      // 1. 创建订单
      const newOrder = await prisma.order.create({
        data: {
          userId: user.id,
          totalAmount: Number(totalAmount),
          status: "pending",
          customization,
        },
      });

      // 2. 更新产品关联
      await prisma.product.update({
        where: { id: product.id },
        data: { orderId: newOrder.id },
      });

      // 3. 返回完整订单
      return prisma.order.findUnique({
        where: { id: newOrder.id },
        include: { products: true },
      });
    });

    return new NextResponse(JSON.stringify(order), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Request error:", error);
    return new NextResponse(null, { status: 500 });
  }
}
