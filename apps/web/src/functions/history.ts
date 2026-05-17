interface HistoryStats {
  year: number;
  count: number;
}

export function history(posts: { date: Date; active: boolean }[]): HistoryStats[] {
  // Groups active games by release year for the sidebar filter.
  const map = new Map<number, number>();

  for (const { date, active } of posts) {
    if (!active) continue;
    const year = date.getFullYear();
    map.set(year, (map.get(year) || 0) + 1);
  }

  return Array.from(map.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => b.year - a.year);
}
