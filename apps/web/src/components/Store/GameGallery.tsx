"use client";

import { useState } from "react";
import { GameImage } from "@/components/Store/GameImage";

export function GameGallery({
  title,
  images,
}: {
  title: string;
  images: string[];
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedImage = selectedIndex === null ? null : images[selectedIndex];

  const showPrevious = () => {
    // Wraps around so users can browse all gallery images in one modal.
    setSelectedIndex((currentIndex) =>
      currentIndex === null ? 0 : (currentIndex - 1 + images.length) % images.length,
    );
  };

  const showNext = () => {
    // Moves to the next gameplay image without closing the modal.
    setSelectedIndex((currentIndex) =>
      currentIndex === null ? 0 : (currentIndex + 1) % images.length,
    );
  };

  return (
    <>
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className="group overflow-hidden rounded-xl text-left shadow-md outline-none ring-blue-500 transition focus:ring-4"
          >
            <GameImage
              src={image}
              alt={`${title} gameplay image`}
              title={title}
              className="aspect-[16/9] w-full object-cover transition duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} enlarged gameplay image`}
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="relative flex max-h-[92vh] w-full max-w-6xl items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close enlarged image"
              className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl font-black text-gray-950 shadow-lg transition hover:bg-gray-200"
              onClick={() => setSelectedIndex(null)}
            >
              x
            </button>
            <button
              type="button"
              aria-label="Previous gameplay image"
              className="absolute left-0 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-3xl font-black text-gray-950 shadow-lg transition hover:bg-white"
              onClick={showPrevious}
            >
              &lt;
            </button>
            <button
              type="button"
              aria-label="Next gameplay image"
              className="absolute right-0 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-3xl font-black text-gray-950 shadow-lg transition hover:bg-white"
              onClick={showNext}
            >
              &gt;
            </button>
            <GameImage
              src={selectedImage}
              alt={`${title} enlarged gameplay image`}
              title={title}
              className="max-h-[86vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
