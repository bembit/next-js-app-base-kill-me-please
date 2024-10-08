import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import "./globals.css";
import Providers from "./providers";
import { ThemeProvider } from "@/components/ThemeProvider"
// import ThemeWrapper from "@/components/ThemeWrapper";
import Nav from "@/components/Nav";


const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Next Auth App", 
  description: "Generated by create next/cloudflare",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers>
          {/* app-index.js:33 Warning: Extra attributes from the server: class,style */}
          <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <main className="flex min-h-screen flex-col items-center bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200">
                <Nav />
                {children}
              </main>
          </ThemeProvider>
          {/* <ThemeWrapper>{children}</ThemeWrapper> */}
        </Providers> 
      </body>
    </html>
  );
}
