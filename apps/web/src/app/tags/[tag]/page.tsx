import { notFound } from "next/navigation";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getPublicPosts } from "@/functions/posts";

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const posts = await getPublicPosts();

  const filteredPosts = posts.filter((post) => {
    // Platform names are slugged so URLs stay readable.
    const tags = post.tags
      .split(",")
      .map((value) => value.trim().toLowerCase().replace(/\s+/g, "-"));

    return tags.includes(tag.toLowerCase());
  });

  if (filteredPosts.length === 0) notFound();

  return (
    <AppLayout>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}
