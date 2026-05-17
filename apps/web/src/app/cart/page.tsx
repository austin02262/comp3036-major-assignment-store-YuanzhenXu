import { AppLayout } from "@/components/Layout/AppLayout";
import { CartPage } from "@/components/Store/CartPage";

export default function CartRoute() {
  // Legacy cart route now points to the store cart component.
  return (
    <AppLayout>
      <CartPage />
    </AppLayout>
  );
}
