export function SummaryItem({
  name,
  link,
  count,
  isSelected,
  title,
}: {
  name: string;
  link: string;
  count: number;
  isSelected: boolean;
  title?: string;
}) {
  // Reusable row for sidebar filters with a count badge.
  const displayTitle = title || `${name} (${count})`;
  
  return (
    <a
      href={link}
      title={displayTitle}
      className={`flex items-center justify-between rounded-lg px-2 py-2 text-sm transition ${
        isSelected
          ? "bg-blue-700 font-bold text-white shadow-sm"
          : "text-gray-700 hover:bg-blue-50 hover:text-blue-700 dark:text-gray-200 dark:hover:bg-white/10 dark:hover:text-white"
      }`}
    >
      <span className="truncate">{name}</span>
      <span 
        data-test-id="filter-count"
        className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-xs ${
          isSelected
            ? "bg-white/20 text-white"
            : "bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-300"
        }`}
      >
        {count}
      </span>
    </a>
  );
}
