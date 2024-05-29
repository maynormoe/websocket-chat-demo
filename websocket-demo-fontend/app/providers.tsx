"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { usePathname, useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { Link } from "@nextui-org/link";

import { Navbar } from "@/components/navbar";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  const pathName = usePathname();

  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <div className="relative flex flex-col h-screen">
          {pathName !== "/login" && <Navbar />}
          <main className="container mx-auto max-w-7xl px-6 py-8 flex-grow">
            {children}
          </main>
          {pathName !== "/login" && (
            <footer className="w-full flex items-center justify-center py-3">
              <Link
                isExternal
                className="flex items-center gap-1 text-current"
                href="https://github.com/maynormoe/websocket-chat-demo"
                title="nextui.org homepage"
              >
                <span className="text-default-600">Powered by</span>
                <p className="text-primary">demo项目地址</p>
              </Link>
            </footer>
          )}
        </div>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
