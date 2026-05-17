import { AppLayout } from "@/components/Layout/AppLayout";
import { PurchaseHistoryPage } from "@/components/Store/PurchaseHistoryPage";

export default function PurchasesRoute() {
  // Shows mock purchase history saved by the checkout flow.
  return (
    <AppLayout>
      <PurchaseHistoryPage />
    </AppLayout>
  );
}
