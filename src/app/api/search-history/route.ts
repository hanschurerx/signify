import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/search-history - 获取搜索历史
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const searchHistory = await prisma.searchHistory.findMany({
      where: userId ? { userId } : undefined,
      orderBy: {
        createdAt: "desc",
      },
      take: 10, // 只返回最近的10条记录
    });

    return NextResponse.json(searchHistory);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch search history" },
      { status: 500 }
    );
  }
}

// POST /api/search-history - 记录新的搜索
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, userId } = body;

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    const searchHistory = await prisma.searchHistory.create({
      data: {
        query,
        userId,
      },
    });

    return NextResponse.json(searchHistory, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create search history" },
      { status: 500 }
    );
  }
}

// DELETE /api/search-history - 清除搜索历史
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await prisma.searchHistory.deleteMany({
      where: {
        userId,
      },
    });

    return NextResponse.json({ message: "Search history cleared" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to clear search history" },
      { status: 500 }
    );
  }
}
