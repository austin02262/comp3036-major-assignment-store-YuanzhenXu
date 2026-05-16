import { AppLayout } from "@/components/Layout/AppLayout";
import { PurchaseHistoryPage } from "@/components/Store/PurchaseHistoryPage";

export default function PurchasesRoute() {
  return (
    <AppLayout>
      <PurchaseHistoryPage />
    </AppLayout>
  );
}
