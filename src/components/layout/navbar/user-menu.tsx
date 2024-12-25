// apps/frontend/components/layout/navbar/user-menu.tsx
"use client";

import { User, getUser } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  if (user) {
    return (
      <>
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          {user.email}
        </span>
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 underline-offset-4 hover:text-red-600 hover:underline"
        >
          退出
        </button>
      </>
    );
  }

  return (
    <>
      <Link
        href="/login"
        className="text-sm text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
      >
        登录
      </Link>
      <Link
        href="/register"
        className="text-sm text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
      >
        注册
      </Link>
    </>
  );
}
