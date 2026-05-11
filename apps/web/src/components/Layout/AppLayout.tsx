import type { PropsWithChildren } from "react";
import { LeftMenu } from "../Menu/LeftMenu";
import { TopMenu } from "../Layout/TopMenu";
import { ThemeProvider } from "@/components/Themes/ThemeContext";
// children: the content in this page, query: let search bar search 
export function AppLayout({ children, query }: PropsWithChildren<{ query?: string }>) {
  return (
    <ThemeProvider>  {/* themeProvider to ensure the whole page will change theme dark to light*/}
      <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
        <div className="flex">
          <aside className="w-64 shrink-0 border-r border-gray-200 bg-white">
            <LeftMenu />
          </aside>

          <main className="flex-1 min-w-0">
            <TopMenu query={query} /> {/* title/search bar/ theme button*/}
            <div className="max-w-7xl mx-auto px-4 py-8"> {/* show the content under top menu here*/}
              {children}
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
