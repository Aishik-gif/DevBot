import AppBar from "@/components/AppBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="h-screen">
      <AppBar />
      <SidebarProvider className="min-h-0 max-h-[calc(100svh-4.1rem)] h-full">{children}</SidebarProvider>
     
    </div>
  );
};

export default Layout;
