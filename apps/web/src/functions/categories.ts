export function categories(
  products: { category: string; active?: boolean }[],
): { name: string; count: number }[] {
  // Builds genre filter counts for the left sidebar.
  const result = products
    .filter((product) => product.active !== false)
    .reduce(
      (acc, product) => {
        const category = acc.find((c) => c.name === product.category);
        if (category) {
          category.count++;
        } else {
          acc.push({ name: product.category, count: 1 });
        }
        return acc;
      },
      [] as { name: string; count: number }[],
    );
  return result.sort((a, b) => a.name.localeCompare(b.name));
}
