interface TagCount {
  name: string;
  count: number;
}

export function tags(posts: { tags: string; active: boolean }[]): TagCount[] {
  // Converts comma-separated platform tags into sidebar counts.
  const map = new Map<string, number>();

  for (const { tags, active } of posts) {
    if (!active) continue;

    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");

    for (const tag of tagList) {
      map.set(tag, (map.get(tag) || 0) + 1);
    }
  }

  return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
}

