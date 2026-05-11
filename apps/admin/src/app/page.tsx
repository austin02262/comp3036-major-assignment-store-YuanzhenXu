// apps/admin/src/app/page.tsx
import { isLoggedIn } from "../utils/auth";
import { PostList } from "../components/PostList";
import { LogoutButton } from "../components/LogoutButton";
import styles from "./page.module.css";
import { client } from "@repo/db/client";


export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ saved?: string }>;
}) {
  // Check if user is logged in by verifying the auth_token cookie
  const loggedIn = await isLoggedIn();
  const params = searchParams ? await searchParams : {};

  // ===== UNAUTHENTICATED VIEW: Login Screen =====
  if (!loggedIn) {
    return (
      <main className={styles.loginBox}>
        <h1>Sign in to your account</h1>
        {/* This now submits to the unified auth route, which supports both form and JSON requests. */}
        <form method="POST" action="/api/auth">
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            required 
          />
          <button type="submit">Sign In</button>
        </form>
      </main>
    );
  }

  // Load posts from the database on the server so the admin list starts with real persisted data.
  const posts = await client.db.post.findMany({
    orderBy: {
      date: "desc",
    },
  });

  // ===== AUTHENTICATED VIEW: Admin Dashboard =====
  return (
    <main className={styles.main}>
      {/* Header section with title and action buttons */}
      <div className={styles.header}>
        <h1>Admin of Full Stack Blog</h1>
        <div className={styles.actions}>
          {/* Navigates to post creation screen */}
          <a href="/posts/create" className={styles.createBtn}>Create Post</a>
          {/* Logout uses the auth DELETE endpoint required by the assignment. */}
          <LogoutButton className={styles.logoutBtn} />
        </div>
      </div>

      {params.saved === "1" && (
        <p
          style={{
            marginBottom: "20px",
            padding: "12px",
            borderRadius: "6px",
            background: "#ecfdf5",
            color: "#065f46",
          }}
        >
          Post updated successfully
        </p>
      )}
      
     
      {/* Pass server-fetched posts into the client component so filtering/toggling can happen locally. */}
      <PostList initialPosts={posts} />
    </main>
  );
}
