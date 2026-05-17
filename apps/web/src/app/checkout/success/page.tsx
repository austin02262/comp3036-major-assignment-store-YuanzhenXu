import { AppLayout } from "@/components/Layout/AppLayout";

export default async function CheckoutSuccessRoute({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  // Confirmation page displays the mock order id from checkout.
  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 text-center shadow-md">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-700">
          Purchase complete
        </p>
        <h1 className="mt-3 text-3xl font-bold text-gray-950">
          Thanks for your order
        </h1>
        <p className="mt-4 text-gray-600">
          Your mock payment was accepted and the order has been saved in the
          browser for this frontend prototype.
        </p>
        {order && (
          <p className="mt-4 rounded-md bg-gray-100 px-4 py-3 font-mono text-sm text-gray-800">
            Order {order}
          </p>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href="/"
            className="rounded-md bg-red-700 px-4 py-2 font-semibold text-white hover:bg-red-800"
          >
            Continue Shopping
          </a>
          <a
            href="/purchases"
            className="rounded-md bg-gray-950 px-4 py-2 font-semibold text-white hover:bg-gray-800"
          >
            View Purchases
          </a>
        </div>
      </div>
    </AppLayout>
  );
}
