interface TagCount {
  name: string;
  count: number;
}

export function tags(products: { platforms: string[]; active?: boolean }[]): TagCount[] {
  // Converts product platforms into sidebar counts.
  const map = new Map<string, number>();

  for (const { platforms, active } of products) {
    if (active === false) continue;

    const platformList = platforms
      .map((platform) => platform.trim())
      .filter((t) => t !== "");

    for (const platform of platformList) {
      map.set(platform, (map.get(platform) || 0) + 1);
    }
  }

  return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
}

