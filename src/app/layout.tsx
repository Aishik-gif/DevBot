import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ContainerContext from "@/providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "DevBot-AI Code Generator",
  description: "AI Code Generator mode by Aishik Dutta devbot.22102002.xyz",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        <ContainerContext>{children}</ContainerContext>
      </body>
    </html>
  );
}
