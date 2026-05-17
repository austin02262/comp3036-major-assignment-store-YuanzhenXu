import type { Post } from "@repo/db/data";
import { AddToCartButton } from "@/components/Store/AddToCartButton";
import { GameGallery } from "@/components/Store/GameGallery";
import { GameImage } from "@/components/Store/GameImage";
import { formatPrice, postToProduct } from "@/lib/storeProducts";

export function BlogDetail({
  post,
}: {
  post: Post;
  likes: number;
  liked: boolean;
}) {
  // Reuses the old blog detail route as a product detail page.
  const product = postToProduct(post);

  return (
    <article data-test-id={`blog-post-${post.id}`} className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl bg-gray-950 text-white shadow-2xl shadow-gray-950/15">
        <GameImage
          src={product.imageUrl}
          alt={product.title}
          title={product.title}
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/85 to-gray-950/20" />

        <div className="relative grid gap-8 px-6 py-10 md:grid-cols-[1fr_330px] md:px-8 lg:px-10">
          <div>
            <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide">
              <a
                href={`/category/${encodeURIComponent(product.category.toLowerCase())}`}
                className="rounded-full bg-red-600 px-3 py-1 text-white hover:bg-red-700"
              >
                {product.category}
              </a>
              {product.platforms.map((platform) => (
                <a
                  key={platform}
                  href={`/tags/${encodeURIComponent(platform.toLowerCase().replace(/\s+/g, "-"))}`}
                  className="rounded-full bg-white/15 px-3 py-1 text-white hover:bg-white/25"
                >
                  {platform}
                </a>
              ))}
              <a
                href={`/search?q=${product.releaseYear}`}
                className="rounded-full bg-white/15 px-3 py-1 text-white hover:bg-white/25"
              >
                Released {product.releaseYear}
              </a>
            </div>

            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
              {product.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-200">
              {product.description}
            </p>
          </div>

          <aside className="h-fit rounded-xl border border-white/10 bg-white/10 p-5 shadow-xl backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-wide text-red-200">
              Digital edition
            </p>
            <p className="mt-3 text-4xl font-bold">{formatPrice(product.price)}</p>
            <div className="mt-6">
              <AddToCartButton product={product} />
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-xl border border-gray-200/70 bg-white/85 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <h2 className="text-2xl font-bold text-gray-950 dark:text-white">About This Game</h2>
          <p className="mt-4 text-base leading-8 text-gray-700 dark:text-gray-300">{product.content}</p>
        </div>

        <div className="rounded-xl bg-gray-950 p-6 text-white shadow-sm dark:border dark:border-white/10">
          <h2 className="text-lg font-bold">Product Details</h2>
          <dl className="mt-4 space-y-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-gray-400">Genre</dt>
              <dd className="font-semibold">{product.category}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-400">Platform</dt>
              <dd className="text-right font-semibold">{product.platform}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-400">Release Date</dt>
              <dd className="text-right font-semibold">{product.releaseDate}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200/70 bg-white/85 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-red-700">
              In-game Media
            </p>
            <h2 className="mt-1 text-2xl font-bold text-gray-950 dark:text-white">Gameplay Gallery</h2>
          </div>
        </div>

        <GameGallery title={product.title} images={product.screenshots} />
      </section>
    </article>
  );
}
