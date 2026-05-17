import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getPublicPosts } from "@/functions/posts";

export default async function ReleaseYearPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  const yearNum = parseInt(year, 10);
  const posts = await getPublicPosts();

  // Shows only games released in the selected year.
  const filteredPosts = posts.filter(
    (post) => post.date.getFullYear() === yearNum,
  );

  return (
    <AppLayout>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}
