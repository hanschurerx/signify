import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductPage from "./page";
import { Metadata } from "next";

interface PageParams {
  params: {
    id: string;
  };
}

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) notFound();

  // 确保 sizes 和 finishOptions 是正确的格式
  const formattedProduct = {
    ...product,
    sizes: product.sizes as Array<{
      id: string;
      name: string;
      price: number;
    }>,
    finishOptions: product.finishOptions as Array<{
      id: string;
      name: string;
      price: number;
    }>,
    description: product.description || "", // 确保 description 不为 null
  };

  return formattedProduct;
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const product = await getProduct(params.id);

  return {
    title: `${product.title} - Signify`,
    description: product.description || "",
  };
}

export default async function ProductPageServer({ params }: PageParams) {
  const product = await getProduct(params.id);
  return <ProductPage product={product} />;
}
