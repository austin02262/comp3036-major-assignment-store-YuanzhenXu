import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getPublicPosts } from "@/functions/posts";

export default async function HistoryPage({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year, month } = await params;
  const posts = await getPublicPosts();

  // Convert year and month from string to number
  const yearNum = parseInt(year, 10);
  const monthNum = parseInt(month, 10);

  // Filter posts that match the given year and month
  const filteredPosts = posts.filter(post => {
    const postYear = post.date.getFullYear();
    const postMonth = post.date.getMonth() + 1; // 0-based

    return postYear === yearNum && postMonth === monthNum;
  });

  
  return (
    <AppLayout>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}
