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
  const displayTitle = title || `${name} (${count})`;
  
  return (
    <a
      href={link}
      title={displayTitle}
      className={`flex justify-between items-center px-2 py-1 rounded-md transition-colors ${
        isSelected
          ? "selected font-bold"
          : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      <span className="truncate">{name}</span>
      <span 
        data-test-id="post-count"
        className="text-sm text-gray-500 ml-2 shrink-0"
      >
        {count}
      </span>
    </a>
  );
}