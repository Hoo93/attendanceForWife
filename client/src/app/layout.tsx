"use client";
import Providers from ".";
import "./globals.css";
import { useRouter } from "next/navigation";
import { accessToken } from "./utils";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
