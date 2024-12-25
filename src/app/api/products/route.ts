import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

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
    const body = await request.json();
    const {
      title,
      description,
      price,
      imageUrl,
      mediaType,
      category,
      sizes,
      finishOptions,
    } = body as {
      title: string;
      description?: string;
      price: number;
      imageUrl?: string;
      mediaType: string;
      category: string;
      sizes: Prisma.InputJsonValue;
      finishOptions: Prisma.InputJsonValue;
    };

    if (!title || !price || !mediaType || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const productData: Prisma.ProductCreateInput = {
      title,
      description,
      price: parseFloat(price.toString()),
      imageUrl,
      mediaType,
      category,
      sizes,
      finishOptions,
      status: "active",
      featured: false,
    };

    const product = await prisma.product.create({
      data: productData,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
