"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/auth";
import { use } from "react";

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  address: string;
  createdAt: string;
  products: Array<{
    id: string;
    title: string;
    description: string;
    price: number;
    mediaType: string;
  }>;
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      const user = getUser();
      const token = localStorage.getItem("token");

      if (!user || !token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(`/api/orders/${resolvedParams.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            router.push("/login");
            return;
          }
          throw new Error("Failed to fetch order");
        }

        const data = await res.json();
        setOrder(data);
      } catch (_error) {
        setError("获取订单信息失败");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [resolvedParams.id, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">加载中...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">{error || "订单不存在"}</div>
      </div>
    );
  }

  const statusMap: Record<string, { text: string; color: string }> = {
    pending: { text: "待支付", color: "bg-yellow-100 text-yellow-800" },
    paid: { text: "已支付", color: "bg-green-100 text-green-800" },
    shipped: { text: "已发货", color: "bg-blue-100 text-blue-800" },
    delivered: { text: "已送达", color: "bg-gray-100 text-gray-800" },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">订单详情</h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* 订单状态和基本信息 */}
          <div className="p-6 border-b">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-sm text-gray-500">订单编号</div>
                <div className="font-medium">{order.id}</div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  statusMap[order.status]?.color || "bg-gray-100 text-gray-800"
                }`}
              >
                {statusMap[order.status]?.text || order.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">下单时间</div>
                <div className="font-medium">
                  {new Date(order.createdAt).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">订单金额</div>
                <div className="font-medium">${order.totalAmount}</div>
              </div>
            </div>
          </div>

          {/* 收货地址 */}
          <div className="p-6 border-b">
            <h2 className="font-medium mb-2">收货地址</h2>
            <p className="text-gray-600">{order.address}</p>
          </div>

          {/* 商品列表 */}
          <div className="p-6">
            <h2 className="font-medium mb-4">商品信息</h2>
            <div className="space-y-4">
              {order.products.map((product) => (
                <div
                  key={product.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium">{product.title}</div>
                    <div className="text-sm text-gray-500">
                      {product.description}
                    </div>
                    <div className="text-sm text-gray-500">
                      类型: {product.mediaType}
                    </div>
                  </div>
                  <div className="font-medium">${product.price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
