import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import TopBanner from "@/components/TopBanner";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "JNHH Gaming — Get Your Coupon",
  description:
    "Request a coupon and pay through the method you trust. Official JNHH Gaming coupon request system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <TopBanner />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
