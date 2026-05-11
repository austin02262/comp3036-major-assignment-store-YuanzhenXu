import { history } from "@/functions/history";
import { type Post } from "@repo/db/data";
import { SummaryItem } from "./SummaryItem";

const months = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function HistoryList({
  selectedYear,
  selectedMonth,
  posts,
}: {
  selectedYear?: string;
  selectedMonth?: string;
  posts: Post[];
}) {
  const historyItems = history(posts);

  if (historyItems.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">History</h3>
      <ul className="space-y-2">
        {historyItems.map(({ year, month, count }) => {
          const monthName = months[month] || "";
          const displayName = `${monthName}, ${year}`;
          const link = `/history/${year}/${month}`;
          const isSelected =
            selectedYear === year.toString() && selectedMonth === month.toString();
          return (
            <li key={`${year}-${month}`}>
              <SummaryItem
                name={displayName}
                title={`History / ${displayName}`}
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