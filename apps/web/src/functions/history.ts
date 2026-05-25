interface HistoryStats {
  year: number;
  count: number;
}

export function history(products: { releaseYear: number; active?: boolean }[]): HistoryStats[] {
  // Groups active games by release year for the sidebar filter.
  const map = new Map<number, number>();

  for (const { releaseYear, active } of products) {
    if (active === false) continue;
    map.set(releaseYear, (map.get(releaseYear) || 0) + 1);
  }

  return Array.from(map.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => b.year - a.year);
}
