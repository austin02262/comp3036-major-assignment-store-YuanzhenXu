import { isLoggedIn } from "../../../utils/auth";
import { ProductForm } from "../../../components/ProductForm";
import { redirect } from "next/navigation";
import { client } from "@repo/db/client";
import { adminProducts } from "../../../data/adminProducts";
import { productRecordToAdminProduct } from "../../../data/productRecordToAdminProduct";

interface PageProps {
  params: Promise<{ urlId: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  // Only signed-in admins can edit games.
  const loggedIn = await isLoggedIn();
  
  if (!loggedIn) {
    redirect('/');
  }

  // The urlId chooses which product opens in the edit form.
  const { urlId } = await params;

  let product = adminProducts.find((item) => item.urlId === urlId);

  try {
    const databaseProduct = await client.db.product.findUnique({
      where: { urlId },
      include: { category: true },
    });

    if (databaseProduct) {
      product = productRecordToAdminProduct(databaseProduct);
    }
  } catch {
    // Static product data keeps edit pages available before the database is seeded.
  }

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      <p style={{ color: '#d00000', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase' }}>
        GameHub Admin
      </p>
      <h1 style={{ fontSize: '34px', fontWeight: 900, marginBottom: '24px' }}>Edit Game</h1>
      
      <ProductForm initialData={product} isEditing={true} lookupUrlId={urlId} />
    </main>
  );
}
