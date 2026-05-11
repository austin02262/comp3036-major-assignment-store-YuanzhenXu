import { AppLayout } from "../components/Layout/AppLayout";
import { Main } from "../components/Main";
import { getPublicPosts } from "../functions/posts";
import styles from "./page.module.css";

export default async function Home() {
  const posts = await getPublicPosts();

  return (
    <AppLayout>
      <Main posts={posts} className={styles.main} />
    </AppLayout>
  );
}
