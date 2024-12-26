import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "signify-jwt-secret-key-2024";

async function verifyToken(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || typeof decoded !== "object" || !("userId" in decoded)) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: (decoded as { userId: string }).userId },
    });
    return user;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return new NextResponse(null, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        products: true,
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return new NextResponse(null, { status: 500 });
  }
}
