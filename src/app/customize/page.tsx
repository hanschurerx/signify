"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/auth";

const MEDIA_TYPES = [
  {
    id: "vinyl-banner",
    name: "广告横幅",
    description: "13盎司乙烯基材料，适合室内外使用",
    sizes: [
      { id: "2x4", name: "2' x 4'", price: 29.99 },
      { id: "3x6", name: "3' x 6'", price: 49.99 },
      { id: "4x8", name: "4' x 8'", price: 79.99 },
      { id: "custom", name: "自定义尺寸", price: 6.99 }, // 每平方英尺
    ],
    finishOptions: [
      { id: "hemmed", name: "卷边", price: 0 },
      { id: "grommets", name: "带孔", price: 5 },
      { id: "pole-pocket", name: "杆袋", price: 10 },
    ],
    basePrice: 29.99,
  },
  {
    id: "banner-stand",
    name: "展示架",
    description: "可伸缩铝合金材质，便携式设计",
    sizes: [
      { id: "24x63", name: '24" x 63"', price: 89.99 },
      { id: "33x78", name: '33" x 78"', price: 119.99 },
      { id: "36x86", name: '36" x 86"', price: 149.99 },
    ],
    finishOptions: [
      { id: "single", name: "单面打印", price: 0 },
      { id: "double", name: "双面打印", price: 50 },
    ],
    basePrice: 89.99,
  },
];

export default function CustomizePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [mediaType, setMediaType] = useState(MEDIA_TYPES[0]);
  const [selectedSize, setSelectedSize] = useState(MEDIA_TYPES[0].sizes[0]);
  const [selectedFinish, setSelectedFinish] = useState(
    MEDIA_TYPES[0].finishOptions[0]
  );
  const [customWidth, setCustomWidth] = useState("");
  const [customHeight, setCustomHeight] = useState("");
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  // 检查用户登录状态
  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push("/login");
    } else {
      setUser(currentUser);
    }
  }, [router]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-medium">请先登录</h2>
          <p className="text-gray-500 mt-2">正在跳转到登录页面...</p>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculatePrice = () => {
    let price = selectedSize.price;

    // 如果是自定义尺寸，计算价格
    if (selectedSize.id === "custom" && customWidth && customHeight) {
      const area = parseFloat(customWidth) * parseFloat(customHeight);
      price = area * mediaType.sizes.find((s) => s.id === "custom")!.price;
    }

    // 添加工艺选项价格
    price += selectedFinish.price;

    return price.toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = getUser();
    const token = localStorage.getItem("token");

    if (!user || !token) {
      router.push("/login");
      return;
    }

    try {
      // 先跳转到结账页面，带上必要的参数
      router.push(
        `/checkout?` +
          new URLSearchParams({
            mediaTypeId: mediaType.id,
            customization: JSON.stringify({
              size:
                selectedSize.id === "custom"
                  ? `${customWidth}x${customHeight}`
                  : selectedSize.name,
              finishOption: selectedFinish.name,
              price: calculatePrice(),
            }),
            amount: calculatePrice(),
          })
      );
    } catch (error) {
      console.error("Error:", error);
      alert("操作失败，请重试");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">定制您的产品</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 左侧：产品选项 */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 产品类型选择 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                选择产品类型
              </label>
              <div className="grid grid-cols-2 gap-4">
                {MEDIA_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => {
                      setMediaType(type);
                      setSelectedSize(type.sizes[0]);
                      setSelectedFinish(type.finishOptions[0]);
                    }}
                    className={`p-4 border rounded-lg text-center ${
                      mediaType.id === type.id
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="font-medium">{type.name}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {type.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 尺寸选择 */}
            <div>
              <label className="block text-sm font-medium mb-2">选择尺寸</label>
              <div className="grid grid-cols-2 gap-2">
                {mediaType.sizes.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`p-2 border rounded-lg ${
                      selectedSize.id === s.id
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div>{s.name}</div>
                    <div className="text-sm text-gray-500">${s.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 自定义尺寸输入 */}
            {selectedSize.id === "custom" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    宽度 (英尺)
                  </label>
                  <input
                    type="number"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(e.target.value)}
                    className="w-full rounded-md border-gray-300"
                    min="1"
                    step="0.1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    高度 (英尺)
                  </label>
                  <input
                    type="number"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(e.target.value)}
                    className="w-full rounded-md border-gray-300"
                    min="1"
                    step="0.1"
                    required
                  />
                </div>
              </div>
            )}

            {/* 工艺选项 */}
            <div>
              <label className="block text-sm font-medium mb-2">选择工艺</label>
              <div className="grid grid-cols-2 gap-2">
                {mediaType.finishOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedFinish(option)}
                    className={`p-2 border rounded-lg ${
                      selectedFinish.id === option.id
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div>{option.name}</div>
                    <div className="text-sm text-gray-500">
                      {option.price > 0 ? `+$${option.price}` : "免费"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 图片上传 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                上传您的设计图片
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1 block w-full"
                  required
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={!file}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
            >
              创建产品订单 - ${calculatePrice()}
            </button>
          </form>
        </div>

        {/* 右侧：预览 */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-medium mb-4">产品预览</h2>
          <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden mb-4">
            {preview ? (
              <img
                src={preview}
                alt="Design preview"
                className="absolute inset-0 w-full h-full object-contain"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                请上传设计图片
              </div>
            )}
          </div>
          <div className="space-y-2">
            <p>
              <span className="font-medium">产品类型：</span>
              {mediaType.name}
            </p>
            <p>
              <span className="font-medium">尺寸：</span>
              {selectedSize.id === "custom"
                ? `${customWidth || "0"} x ${customHeight || "0"} 英尺`
                : selectedSize.name}
            </p>
            <p>
              <span className="font-medium">工艺：</span>
              {selectedFinish.name}
            </p>
            <p>
              <span className="font-medium">价格��</span>${calculatePrice()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
