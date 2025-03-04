import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "signify-jwt-secret-key-2024";

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

interface RouteContext {
  params: {
    id: string;
  };
}

// GET - 获取订单详情
export async function GET(request: Request, context: RouteContext) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return new NextResponse(null, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: {
        id: context.params.id,
        userId: user.id,
      },
      include: {
        products: true,
      },
    });

    if (!order) {
      return new NextResponse(null, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return new NextResponse(null, { status: 500 });
  }
}

// PATCH - 更新订单
export async function PATCH(request: Request, context: RouteContext) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return new NextResponse(null, { status: 401 });
    }

    const { address, status } = await request.json();

    const order = await prisma.order.update({
      where: {
        id: context.params.id,
        userId: user.id,
      },
      data: {
        address,
        status,
      },
      include: {
        products: true,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    return new NextResponse(null, { status: 500 });
  }
}
