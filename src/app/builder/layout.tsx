import AppBar from "@/components/AppBar";
import Loader from "@/components/Loader";
import { SidebarProvider } from "@/components/ui/sidebar";
import React, { Suspense } from "react";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <div className="h-screen">
          <AppBar />
          <SidebarProvider className="min-h-0 max-h-[calc(100svh-4.1rem)] h-full">
            {children}
          </SidebarProvider>
        </div>
      </Suspense>
    </>
  );
};

export default Layout;
