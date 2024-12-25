import { Navbar } from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { ReactNode } from "react";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Don't await the fetch, pass the Promise to the context provider

  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
        {/* <CartProvider cartPromise={cart}> */}
        <Navbar />
        <main>
          {children}
          {/* <Toaster closeButton />
          <WelcomeToast /> */}
        </main>
        {/* </CartProvider> */}
      </body>
    </html>
  );
}
