export function categories<T>(
  posts: { category: string; active: boolean }[],
): { name: string; count: number }[] {
  const result = posts
    .filter((p) => p.active)
    .reduce(
      (acc, post) => {
        const category = acc.find((c) => c.name === post.category);
        if (category) {
          category.count++;
        } else {
          acc.push({ name: post.category, count: 1 });
        }
        return acc;
      },
      [] as { name: string; count: number }[],
    );
  return result.sort((a, b) => a.name.localeCompare(b.name));
}
