import { isLoggedIn } from "../../../utils/auth";
import { ProductForm } from "../../../components/ProductForm";
import { redirect } from "next/navigation";


export default async function CreateProductPage() {
  // Check authentication - redirect to home (login) if not logged in
  const loggedIn = await isLoggedIn();
  
  if (!loggedIn) {
    redirect('/');
  }

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      <p style={{ color: '#d00000', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase' }}>
        GameHub Admin
      </p>
      <h1 style={{ fontSize: '34px', fontWeight: 900, marginBottom: '24px' }}>Add New Game</h1>
      
      <ProductForm />
    </main>
  );
}
