interface HistoryStats {
  year: number;
  month: number;
  count: number;
}

export function history(posts: { date: Date; active: boolean }[]): HistoryStats[] {
  const map = new Map<string, number>();

  for (const { date, active } of posts) {
    if (!active) continue;                // skip those which are inactive
    const year = date.getFullYear();      
    const month = date.getMonth() + 1;    // from 0 to 11 so , should plus 1
    const key = `${year}-${month}`;       // "yyyy-MM"
    map.set(key, (map.get(key) || 0) + 1);   // key exist then keep plus 1, not exist then start from 0 and plus 1
  }

  return Array.from(map.entries())
    .map(([key, count]) => {
      const [year, month] = key.split('-').map(Number) as [number, number];
      //key is "yyyy-mm", key split, then becomes: "yyyy,mm"
      //map(number):yyyy,mm
      return { year, month, count };
    })
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year; // put the bigger one at the front
      return b.month - a.month;                     
    });
}
