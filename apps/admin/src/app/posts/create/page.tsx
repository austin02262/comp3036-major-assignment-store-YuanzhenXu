// apps/admin/src/app/posts/create/page.tsx
import { isLoggedIn } from "../../../utils/auth";
import { PostForm } from "../../../components/PostForm";
import { redirect } from "next/navigation";


export default async function CreatePostPage() {
  // Check authentication - redirect to home (login) if not logged in
  const loggedIn = await isLoggedIn();
  
  if (!loggedIn) {
    redirect('/');
  }

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '32px' }}>Create Post</h1>
      
      <PostForm />
    </main>
  );
}