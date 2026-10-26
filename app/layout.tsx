import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MainLayout } from "@/layouts/main-layout";
import { THEME_INIT_SCRIPT } from "@/utils/theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "뚜비컨티뉴",
  description: "자격증 개념 정리와 기출문제 풀이",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // 테마 스크립트가 hydration 전에 class·style을 바꾸므로 <html>의 속성 차이는 경고하지 않는다
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-muted">
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
