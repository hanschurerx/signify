// app/login/page.tsx
"use client";
import { setAuth } from "@/lib/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const identifier = formData.get(loginMethod) as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [loginMethod]: identifier,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setAuth(data.token, data.user);
        router.push("/");
        router.refresh();
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("登录失败，请稍后重试");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 dark:bg-neutral-900">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-black">
        <div>
          <h2 className="text-center text-3xl font-bold text-black dark:text-white">
            登录
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md border border-red-500 bg-red-50 p-4 text-red-500 dark:border-red-400 dark:bg-red-900/30 dark:text-red-400">
              {error}
            </div>
          )}
          <div className="space-y-4 rounded-md">
            <div className="flex justify-center space-x-4 mb-4">
              <button
                type="button"
                onClick={() => setLoginMethod("email")}
                className={`px-4 py-2 rounded ${
                  loginMethod === "email"
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
                    : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                }`}
              >
                邮箱登录
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod("phone")}
                className={`px-4 py-2 rounded ${
                  loginMethod === "phone"
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
                    : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                }`}
              >
                手机号登录
              </button>
            </div>

            {loginMethod === "email" ? (
              <div>
                <label htmlFor="email" className="sr-only">
                  邮箱
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="relative block w-full rounded-md border border-neutral-200 bg-white p-2 text-neutral-900 placeholder-neutral-400 focus:border-neutral-500 focus:ring-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:placeholder-neutral-500"
                  placeholder="邮箱地址"
                />
              </div>
            ) : (
              <div>
                <label htmlFor="phone" className="sr-only">
                  手机号
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="relative block w-full rounded-md border border-neutral-200 bg-white p-2 text-neutral-900 placeholder-neutral-400 focus:border-neutral-500 focus:ring-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:placeholder-neutral-500"
                  placeholder="手机号"
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="sr-only">
                密码
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full rounded-md border border-neutral-200 bg-white p-2 text-neutral-900 placeholder-neutral-400 focus:border-neutral-500 focus:ring-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:placeholder-neutral-500"
                placeholder="密码"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md bg-neutral-900 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-100"
            >
              登录
            </button>
            <div className="text-center text-sm text-neutral-600 dark:text-neutral-400">
              还没有账号？
              <Link
                href="/register"
                className="font-medium text-neutral-900 hover:text-neutral-700 dark:text-white dark:hover:text-neutral-300"
              >
                立即注册
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
