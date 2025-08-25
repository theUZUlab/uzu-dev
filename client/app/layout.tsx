import type { ReactNode } from "react";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko-KR">
      <body>{children}</body>
    </html>
  );
}
