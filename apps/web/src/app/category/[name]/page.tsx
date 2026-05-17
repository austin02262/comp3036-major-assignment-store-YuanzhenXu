import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getPublicPosts } from "@/functions/posts";

export default async function CategoryPage({ 
  params 
}: { 
  params: Promise<{ name: string }> 
}) {
  const { name } = await params;
  const categoryName = decodeURIComponent(name);
  const posts = await getPublicPosts();

  // Filters games by genre from the sidebar links.
  const filteredPosts = posts.filter(
    post => post.category.toLowerCase() === categoryName.toLowerCase()
  );

  return (
    <AppLayout>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}
