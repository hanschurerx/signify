import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

// 定义类型
type Size = {
  name: string;
  id: string;
  price: number;
};

type FinishOption = {
  name: string;
  id: string;
  price: number;
};

type Product = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  price: number;
  sizes: string;
  finishOptions: string;
  status: string;
  category: string | null;
  createdAt: Date;
};

type SearchParams = {
  category?: string;
};

async function getProducts(category?: string) {
  const products = await prisma.product.findMany({
    where: {
      status: "active",
      ...(category && category !== "all" ? { category } : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // 解析 JSON 字段，添加错误处理
  return products.map((product) => {
    try {
      const sizes = JSON.parse(product.sizes as string);
      const finishOptions = JSON.parse(product.finishOptions as string);

      return {
        ...product,
        sizes: Array.isArray(sizes) ? sizes : [],
        finishOptions: Array.isArray(finishOptions) ? finishOptions : [],
      };
    } catch (error) {
      console.error(`Error parsing JSON for product ${product.id}:`, error);
      return {
        ...product,
        sizes: [],
        finishOptions: [],
      };
    }
  });
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const products = await getProducts(searchParams?.category);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group"
          >
            <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full">
              <div className="aspect-video relative">
                {product.imageUrl && (
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 group-hover:text-indigo-600">
                  {product.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  {product.description}
                </p>
                <div className="space-y-2">
                  {/* 尺寸选项 */}
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">可选尺寸：</span>
                    {product.sizes
                      .slice(0, 3)
                      .map((size) => size.name)
                      .join("、")}
                    {product.sizes.length > 3 && "..."}
                  </div>
                  {/* 工艺选项 */}
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">工艺选项：</span>
                    {product.finishOptions
                      .map((option) => option.name)
                      .join("、")}
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <span className="text-lg font-bold">
                    起价 ${product.price}
                  </span>
                  <span className="text-sm text-indigo-600 group-hover:translate-x-1 transition-transform">
                    立即定制 →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
