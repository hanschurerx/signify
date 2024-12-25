import Footer from "@/components/layout/footer";
import { ReactNode } from "react";

export default async function PageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
}
