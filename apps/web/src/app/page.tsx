import { AppLayout } from "../components/Layout/AppLayout";
import { Main } from "../components/Main";
import { getPublicGames } from "../functions/games";
import styles from "./page.module.css";

export default async function Home() {
  const products = await getPublicGames();

  return (
    <AppLayout>
      <Main products={products} className={styles.main} />
    </AppLayout>
  );
}
