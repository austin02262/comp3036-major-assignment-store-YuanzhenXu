// apps/admin/src/app/post/[urlId]/page.tsx
import { client } from "@repo/db/client";
import { isLoggedIn } from "../../../utils/auth";
import { PostForm } from "../../../components/PostForm";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ urlId: string }>;
}

export default async function EditPostPage({ params }: PageProps) {
  // Check authentication - redirect to home (login) if not logged in
  const loggedIn = await isLoggedIn();
  
  if (!loggedIn) {
    redirect('/');
  }

  // Extract urlId from the dynamic route parameters
  const { urlId } = await params;

  // Fetch the post from Prisma instead of the old in-memory array.
  // This makes edit mode reflect the latest database record.
  const post = await client.db.post.findUnique({
    where: {
      urlId,
    },
  });

  // If post doesn't exist, show 404 page
  if (!post) {
    notFound();
  }

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '32px' }}>Edit Post</h1>
      
      <PostForm initialData={post} isEditing={true} />
    </main>
  );
}
