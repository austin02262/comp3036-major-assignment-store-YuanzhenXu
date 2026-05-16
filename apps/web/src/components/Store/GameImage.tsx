"use client";

import { useState } from "react";

export function GameImage({
  src,
  alt,
  title,
  className,
}: {
  src: string;
  alt: string;
  title: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-gradient-to-br from-gray-950 via-red-950 to-gray-800 p-4 text-center font-bold text-white ${className ?? ""}`}
      >
        {title}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
