// apps/frontend/app/page.tsx
// import { products } from '/lib/data/products';
// import { ProductGrid } from 'components/product-grid';
import Footer from "@/components/layout/footer";

export default async function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-grow">
        {/* 你的主页内容 */}
        <div className="mx-auto max-w-7xl px-6 py-12">
          <h1 className="text-4xl font-bold">欢迎来到我们的网站</h1>
          {/* 其他内容 */}
        </div>
      </div>
      <Footer />
    </div>
  );
}
