"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [preview, setPreview] = useState("");
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      // 创建预览URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name) return;

    // 创建 FormData 对象
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);

    try {
      const response = await fetch("/api/signs/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/sign/${data.id}`);
      }
    } catch (error) {
      console.error("Error uploading sign:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">上传您的签名</h1>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            签名名称
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </label>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            签名图片
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full"
              required
            />
          </label>
        </div>

        {preview && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">预览</h3>
            <div className="border rounded-lg p-4">
              <img
                src={preview}
                alt="Sign preview"
                className="max-w-full h-auto"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          上传签名
        </button>
      </form>
    </div>
  );
}
