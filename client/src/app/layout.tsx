"use client";
import { useEffect } from "react";
import Providers from ".";
import "./globals.css";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const accessToken = Cookies.get("access-token");
  const router = useRouter();
  if (accessToken === undefined) {
    router.push("/auth/login");
  }
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
