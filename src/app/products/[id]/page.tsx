import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) notFound();
  return product;
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const product = await getProduct(params.id);

  return {
    title: `${product.title} - Signify`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: any) {
  const product = await getProduct(params.id);
  const sizes = product.sizes as any[];
  const finishOptions = product.finishOptions as any[];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 左侧：产品图片 */}
        <div className="space-y-4">
          <div className="aspect-video relative rounded-lg overflow-hidden">
            {product.imageUrl && (
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                className="object-cover"
              />
            )}
          </div>
        </div>

        {/* 右侧：产品信息 */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* 产品特点 */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">产品特点</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>高品质材料，专业制作</li>
              <li>多种尺寸可选</li>
              <li>丰富的工艺选项</li>
              <li>快速生产，及时交付</li>
            </ul>
          </div>

          {/* 尺寸选项 */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">可选尺寸</h2>
            <div className="grid grid-cols-2 gap-3">
              {sizes.map((size) => (
                <div
                  key={size.id}
                  className="border rounded-lg p-3 text-center"
                >
                  <div className="font-medium">{size.name}</div>
                  <div className="text-sm text-gray-500">${size.price}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 工艺选项 */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">工艺选项</h2>
            <div className="grid grid-cols-2 gap-3">
              {finishOptions.map((option) => (
                <div
                  key={option.id}
                  className="border rounded-lg p-3 text-center"
                >
                  <div className="font-medium">{option.name}</div>
                  <div className="text-sm text-gray-500">
                    {option.price > 0 ? `+$${option.price}` : "免费"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 价格和定制按钮 */}
          <div className="flex items-center justify-between border-t pt-6">
            <div>
              <div className="text-sm text-gray-500">起价</div>
              <div className="text-3xl font-bold">${product.price}</div>
            </div>
            <Link
              href={`/customize?product=${product.id}`}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700"
            >
              开始定制
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
