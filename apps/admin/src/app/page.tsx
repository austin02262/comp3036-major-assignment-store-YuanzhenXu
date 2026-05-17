// apps/admin/src/app/page.tsx
import { isLoggedIn } from "../utils/auth";
import { ProductList } from "../components/ProductList";
import { LogoutButton } from "../components/LogoutButton";
import styles from "./page.module.css";
import { adminProducts } from "../data/adminProducts";


export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ saved?: string }>;
}) {
  // Protects the admin dashboard with the existing cookie login.
  const loggedIn = await isLoggedIn();
  const params = searchParams ? await searchParams : {};

  // Login screen shown before the admin password is accepted.
  if (!loggedIn) {
    return (
      <main className={styles.loginBox}>
        <p className={styles.loginEyebrow}>GameHub Admin</p>
        <h1>Sign in to manage products</h1>
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

  // Dashboard summary uses the seeded frontend product catalogue.
  const activeProducts = adminProducts.filter((product) => product.active).length;
  const platformCount = new Set(
    adminProducts.flatMap((product) => product.platforms),
  ).size;

  return (
    <main className={styles.main}>
      {/* Main admin actions for adding games and signing out. */}
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>GameHub Storefront</p>
          <h1>Product Admin Dashboard</h1>
          <p className={styles.headerText}>
            Manage video game products, prices, platforms, and storefront
            availability for the B2C store prototype.
          </p>
        </div>
        <div className={styles.actions}>
          <a href="/products/create" className={styles.createBtn}>Add New Game</a>
          {/* Logout uses the auth DELETE endpoint from the original assignment. */}
          <LogoutButton className={styles.logoutBtn} />
        </div>
      </div>

      <section className={styles.stats} aria-label="Store overview">
        <article>
          <span>Total products</span>
          <strong>{adminProducts.length}</strong>
        </article>
        <article>
          <span>Available products</span>
          <strong>{activeProducts}</strong>
        </article>
        <article>
          <span>Platforms</span>
          <strong>{platformCount}</strong>
        </article>
      </section>

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
          Product updated successfully
        </p>
      )}
      
     
      <ProductList initialProducts={adminProducts} />
    </main>
  );
}
