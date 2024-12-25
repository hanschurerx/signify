"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function SearchSkeleton() {
  return (
    <div className="w-full max-w-md animate-pulse">
      <div className="h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-800" />
    </div>
  );
}

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setSearchValue(searchParams?.get("q") || "");
  }, [searchParams]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!searchValue) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("q", searchValue);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          name="search"
          placeholder="搜索..."
          autoComplete="off"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-2 pl-10 text-sm text-black placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 transform">
          <MagnifyingGlassIcon className="h-4 w-4 text-neutral-500" />
        </div>
      </div>
    </form>
  );
}
