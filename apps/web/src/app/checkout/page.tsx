import { AppLayout } from "@/components/Layout/AppLayout";
import { CheckoutPage } from "@/components/Store/CheckoutPage";

export default function CheckoutRoute() {
  // Checkout combines cart review, delivery details, and mock payment.
  return (
    <AppLayout>
      <CheckoutPage />
    </AppLayout>
  );
}
