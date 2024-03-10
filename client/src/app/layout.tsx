"use client";
import Providers from ".";
import "./globals.css";
import { useRouter } from "next/navigation";
import { accessToken } from "./utils/common";
import { useEffect } from "react";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    if (accessToken === undefined) {
      router.push("/");
    }
  }, [accessToken]);
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
