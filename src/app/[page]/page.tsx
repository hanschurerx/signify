import type { Metadata } from "next";

export async function generateMetadata(props: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  return {
    title: `${
      params.page.charAt(0).toUpperCase() + params.page.slice(1)
    } - Signify`,
    description: `This is the ${params.page} page`,
  };
}

export default async function Page(props: {
  params: Promise<{ page: string }>;
}) {
  const params = await props.params;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-4xl font-bold capitalize">{params.page}</h1>
      {/* 页面内容 11*/}
      <div className="mt-6">
        <p className="text-lg text-gray-600">这是 {params.page} 页面的内容</p>
      </div>
    </div>
  );
}
