"use client";

import { useRouter } from "next/navigation";
import ThemeSwitch from "@/components/Themes/ThemeSwitcher";

export function TopMenu({ query = "" }: { query?: string }) {
  const router = useRouter();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const search = event.target.value; // get the input from the searchbar
    router.push(`/search?q=${search}`);  // put the user's input into the url
  };

  return (
    <nav className="sticky top-0 z-10 bg-[var(--background)] text-[var(--text)] border-b border-[var(--text-secondary)]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        <span className="text-xl font-bold text-red-800">Austin's Blog</span>
        <form action="#" method="GET" className="flex-1 max-w-md" onSubmit={(e) => e.preventDefault()}>
          <div className="relative">
            <input
              type="text"                  // input search bar
              name="search"
              placeholder="Search"           
              defaultValue={query}
              onChange={handleSearch}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </form>
        <div className="flex items-center gap-x-4">
          <ThemeSwitch /> 
        </div>
      </div>
    </nav>
  );
}