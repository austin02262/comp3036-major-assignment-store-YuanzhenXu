import type { Post } from "@repo/db/data";
import { GameImage } from "@/components/Store/GameImage";
import { ProductGrid } from "@/components/Store/ProductGrid";

export function BlogList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="rounded-lg border border-gray-800 bg-gray-950 py-16 text-center text-gray-300">
        0 Games
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl bg-blue-950 text-white shadow-2xl shadow-blue-950/15">
        {["/games/scroll1.jpg", "/games/scroll2.png", "/games/scroll3.avif", "/games/scroll4.jpg"].map((src) => (
          <GameImage
            key={src}
            src={src}
            alt="GameHub featured games"
            title="GameHub"
            className="hero-slide absolute inset-0 h-full w-full object-cover opacity-0"
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-950/80 to-blue-950/20" />
        <div className="relative px-6 py-12 md:px-8 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">
              Welcome to GameHub
            </p>
            <h1 className="mt-3 text-4xl font-normal tracking-tight md:text-6xl">
              Your Digital Game Store
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-blue-50">
              Discover console favourites across PlayStation, Xbox, and Nintendo
              Switch. GameHub brings together action adventures, racing games,
              RPGs, and digital editions in one simple storefront, with quick
              filtering, clear prices, and a mock checkout flow for the final
              project demo.
            </p>
          </div>
        </div>
      </section>

      <ProductGrid posts={posts} />
    </div>
  );
}
