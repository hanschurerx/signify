// apps/frontend/components/layout/navbar/user-menu.tsx
"use client";

import { User, getUser } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { UserCircleIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
}

export default function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);

    if (currentUser) {
      fetchOrders();
    }
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/orders/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
    router.refresh();
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "待支付",
      paid: "已支付",
      shipped: "已发货",
      delivered: "已送达",
    };
    return statusMap[status] || status;
  };

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Link
          href="/login"
          className="text-sm text-gray-700 hover:text-gray-900"
        >
          登录
        </Link>
        <Link
          href="/register"
          className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          注册
        </Link>
      </div>
    );
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="flex items-center space-x-1 rounded-full p-2 text-sm text-neutral-500 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800">
        <UserCircleIcon className="h-6 w-6" />
        <span>{user.username}</span>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-neutral-900 dark:ring-neutral-800">
          <div className="px-4 py-3 border-b">
            <p className="text-sm text-gray-500">登录为</p>
            <p className="text-sm font-medium">{user.email}</p>
          </div>

          {/* 最近订单 */}
          <div className="px-4 py-3 border-b">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">最近订单</h3>
              <Link
                href="/orders"
                className="text-xs text-indigo-600 hover:text-indigo-700"
              >
                查看全部
              </Link>
            </div>
            {loading ? (
              <p className="text-sm text-gray-500">加载中...</p>
            ) : orders.length > 0 ? (
              <div className="space-y-2">
                {orders.slice(0, 3).map((order) => (
                  <Link
                    key={order.id}
                    href={`/orders/${order.id}`}
                    className="block p-2 hover:bg-gray-50 rounded-md"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">
                          订单 #{order.id.slice(-8)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          ${order.totalAmount}
                        </p>
                        <p className="text-xs text-gray-500">
                          {getStatusText(order.status)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">暂无订单</p>
            )}
          </div>

          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleLogout}
                  className={`${
                    active
                      ? "bg-neutral-100 dark:bg-neutral-800"
                      : "text-neutral-700 dark:text-neutral-300"
                  } group flex w-full items-center rounded-md px-4 py-2 text-sm`}
                >
                  退出登录
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
