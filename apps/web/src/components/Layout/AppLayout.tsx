import type { PropsWithChildren } from "react";
import { LeftMenu } from "../Menu/LeftMenu";
import { TopMenu } from "../Layout/TopMenu";
import { ThemeProvider } from "@/components/Themes/ThemeContext";
// children: the content in this page, query: let search bar search 
export function AppLayout({ children, query }: PropsWithChildren<{ query?: string }>) {
  return (
    <ThemeProvider>  {/* themeProvider to ensure the whole page will change theme dark to light*/}
      <div className="min-h-screen text-[var(--text)]">
        <TopMenu query={query} /> {/* title/search bar/ theme button*/}
        <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <LeftMenu />
            </div>
          </aside>

          <main className="min-w-0">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
