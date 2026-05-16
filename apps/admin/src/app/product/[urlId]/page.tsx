import { isLoggedIn } from "../../../utils/auth";
import { ProductForm } from "../../../components/ProductForm";
import { adminProducts } from "../../../data/adminProducts";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ urlId: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  // Check authentication - redirect to home (login) if not logged in
  const loggedIn = await isLoggedIn();
  
  if (!loggedIn) {
    redirect('/');
  }

  // Extract urlId from the dynamic route parameters
  const { urlId } = await params;

  const product = adminProducts.find((item) => item.urlId === urlId);

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
