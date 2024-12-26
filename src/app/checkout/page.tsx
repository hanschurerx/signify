"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getUser } from "@/lib/auth";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [user, setUser] = useState<any>(null);

  const orderId = searchParams.get("orderId");
  const totalAmount = searchParams.get("amount");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      // 创建订单
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mediaTypeId: searchParams.get("mediaTypeId"),
          customization: searchParams.get("customization"),
          totalAmount: parseFloat(searchParams.get("amount") || "0"),
          address,
        }),
      });

      if (!orderRes.ok) {
        const errorData = await orderRes.json();
        if (errorData.error === "Unauthorized") {
          router.push("/login");
          return;
        }
        throw new Error(errorData.error || "Failed to create order");
      }

      const order = await orderRes.json();
      router.push(`/orders/${order.id}`);
    } catch (error) {
      console.error("Checkout error:", error);
      alert("支付失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">结账</h1>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="text-sm text-gray-600 mb-2">订单金额</div>
          <div className="text-3xl font-bold">${totalAmount}</div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">收货地址</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows={3}
              className="w-full rounded-lg border-gray-300 shadow-sm"
              placeholder="请输入详细收货地址"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
          >
            {loading ? "处理中..." : "确认支付"}
          </button>
        </form>
      </div>
    </div>
  );
}
