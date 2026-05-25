// apps/admin/src/app/page.tsx
import { isLoggedIn } from "../utils/auth";
import { ProductList } from "../components/ProductList";
import { LogoutButton } from "../components/LogoutButton";
import styles from "./page.module.css";
import { adminProducts } from "../data/adminProducts";
import { productRecordToAdminProduct } from "../data/productRecordToAdminProduct";
import { client } from "@repo/db/client";

type AdminPurchase = {
  id: string;
  total: number;
  createdAt: Date;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  items: {
    id: number;
    quantity: number;
    productTitle: string;
  }[];
};

async function getDashboardProducts() {
  try {
    const products = await client.db.product.findMany({
      include: { category: true },
      orderBy: { id: "asc" },
    });

    if (products.length > 0) {
      return products.map(productRecordToAdminProduct);
    }
  } catch {
    // Static seed data keeps the admin screen usable before the database is ready.
  }

  return adminProducts;
}

async function getRecentPurchases(): Promise<AdminPurchase[]> {
  try {
    return await client.db.purchase.findMany({
      include: {
        user: true,
        items: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });
  } catch {
    return [];
  }
}

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

  // Dashboard summary and product list now read from the store database.
  const products = await getDashboardProducts();
  const purchases = await getRecentPurchases();
  const activeProducts = products.filter((product) => product.active).length;
  const purchaseRevenue = purchases.reduce((sum, purchase) => sum + purchase.total, 0);

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
          <strong>{products.length}</strong>
        </article>
        <article>
          <span>Available products</span>
          <strong>{activeProducts}</strong>
        </article>
        <article>
          <span>Recent orders</span>
          <strong>{purchases.length}</strong>
        </article>
        <article>
          <span>Recent revenue</span>
          <strong>${purchaseRevenue.toFixed(2)}</strong>
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
      
     
      <section className={styles.orders} aria-label="Recent purchases">
        <div className={styles.ordersHeader}>
          <div>
            <p className={styles.eyebrow}>Purchase Records</p>
            <h2>Recent Orders</h2>
          </div>
          <span>{purchases.length} shown</span>
        </div>
        {purchases.length === 0 ? (
          <p className={styles.emptyOrders}>No purchases have been recorded yet.</p>
        ) : (
          <div className={styles.orderList}>
            {purchases.map((purchase) => (
              <article key={purchase.id} className={styles.orderCard}>
                <div>
                  <strong>{purchase.id}</strong>
                  <p>
                    {purchase.user.firstName} {purchase.user.lastName} /{" "}
                    {purchase.user.email}
                  </p>
                  <p>
                    {purchase.items
                      .map((item) => `${item.productTitle} x ${item.quantity}`)
                      .join(", ")}
                  </p>
                </div>
                <div>
                  <strong>${purchase.total.toFixed(2)}</strong>
                  <span>
                    {new Intl.DateTimeFormat("en-AU", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }).format(purchase.createdAt)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <ProductList initialProducts={products} />
    </main>
  );
}
