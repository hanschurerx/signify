"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Size {
  id: string;
  name: string;
  price: number;
}

interface FinishOption {
  id: string;
  name: string;
  price: number;
}

interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  price: number;
  sizes: Size[];
  finishOptions: FinishOption[];
}

export default function ProductPageClient({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedFinish, setSelectedFinish] = useState<FinishOption | null>(
    null
  );

  // 计算总价
  const calculateTotalPrice = () => {
    let total = product.price;
    if (selectedSize) {
      total += selectedSize.price;
    }
    if (selectedFinish) {
      total += selectedFinish.price;
    }
    return total.toFixed(2);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 左侧：产品图片 */}
        <div className="space-y-4">
          <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                暂无图片
              </div>
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
            <h2 className="text-xl font-semibold mb-3">选择尺寸</h2>
            <div className="grid grid-cols-2 gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size)}
                  className={`border rounded-lg p-3 text-center transition-colors ${
                    selectedSize?.id === size.id
                      ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                      : "hover:border-gray-300"
                  }`}
                >
                  <div className="font-medium">{size.name}</div>
                  <div className="text-sm text-gray-500">
                    {size.price > 0 ? `+$${size.price}` : "标准价格"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 工艺选项 */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">选择工艺</h2>
            <div className="grid grid-cols-2 gap-3">
              {product.finishOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedFinish(option)}
                  className={`border rounded-lg p-3 text-center transition-colors ${
                    selectedFinish?.id === option.id
                      ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                      : "hover:border-gray-300"
                  }`}
                >
                  <div className="font-medium">{option.name}</div>
                  <div className="text-sm text-gray-500">
                    {option.price > 0 ? `+$${option.price}` : "免费"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 价格和定制按钮 */}
          <div className="flex items-center justify-between border-t pt-6">
            <div>
              <div className="text-sm text-gray-500">总价</div>
              <div className="text-3xl font-bold">${calculateTotalPrice()}</div>
              {(selectedSize?.price || selectedFinish?.price) && (
                <div className="text-sm text-gray-500">
                  {selectedSize?.price ? `尺寸: +$${selectedSize.price} ` : ""}
                  {selectedFinish?.price
                    ? `工艺: +$${selectedFinish.price}`
                    : ""}
                </div>
              )}
            </div>
            <Link
              href={`/customize?product=${product.id}${
                selectedSize ? `&size=${selectedSize.id}` : ""
              }${selectedFinish ? `&finish=${selectedFinish.id}` : ""}`}
              className={`px-8 py-3 rounded-lg transition-colors ${
                selectedSize && selectedFinish
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
              onClick={(e) => {
                if (!selectedSize || !selectedFinish) {
                  e.preventDefault();
                }
              }}
            >
              {selectedSize && selectedFinish ? "开始定制" : "请选择尺寸和工艺"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
