import { history } from "@/functions/history";
import type { StoreProduct } from "@/lib/storeProducts";
import { SummaryItem } from "./SummaryItem";

export function HistoryList({
  selectedYear,
  products,
}: {
  selectedYear?: string;
  products: StoreProduct[];
}) {
  // Release year links group games by launch year.
  const historyItems = history(products);

  if (historyItems.length === 0) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-950/80">
      <h3 className="mb-4 border-b border-gray-200 pb-3 text-sm font-black uppercase tracking-wide text-gray-950 dark:border-white/10 dark:text-white">Release Year</h3>
      <ul className="space-y-2">
        {historyItems.map(({ year, count }) => {
          const displayName = year.toString();
          const link = `/history/${year}`;
          const isSelected = selectedYear === year.toString();
          return (
            <li key={year}>
              <SummaryItem
                name={displayName}
                title={`Release Year / ${displayName}`}
                link={link}
                count={count}
                isSelected={isSelected}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
