import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;

    if (!file || !name) {
      return NextResponse.json(
        { error: "File and name are required" },
        { status: 400 }
      );
    }

    // 创建上传目录
    const uploadDir = join(process.cwd(), "public", "uploads");
    await writeFile(
      join(uploadDir, file.name),
      Buffer.from(await file.arrayBuffer())
    );

    // 保存签名记录到数据库
    const sign = await prisma.sign.create({
      data: {
        name,
        imageUrl: `/uploads/${file.name}`,
        userId: "temp-user-id", // TODO: 替换为实际的用户ID
      },
    });

    return NextResponse.json(sign, { status: 201 });
  } catch (error) {
    console.error("Error uploading sign:", error);
    return NextResponse.json(
      { error: "Failed to upload sign" },
      { status: 500 }
    );
  }
}
