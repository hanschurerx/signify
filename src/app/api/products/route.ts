import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getUser } from "@/lib/auth";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "signify-jwt-secret-key-2024";

// 验证 token 的函数
async function verifyToken(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    return user;
  } catch {
    return null;
  }
}

// GET /api/products - 获取所有产品
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const products = await prisma.product.findMany({
      where: {
        status: "active",
        ...(category && category !== "all" ? { category } : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products - 创建新产品
export async function POST(request: Request) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, mediaType, size, finishOption, price } = body;

    // 创建产品
    const product = await prisma.product.create({
      data: {
        title,
        mediaType,
        description: `${size} - ${finishOption}`,
        price,
        category: mediaType,
        sizes: JSON.stringify([
          {
            id: "1",
            name: size,
            price: 0,
          },
        ]),
        finishOptions: JSON.stringify([
          {
            id: "1",
            name: finishOption,
            price: 0,
          },
        ]),
        status: "active",
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
