"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  name: string;
}

function ProductImage({
  src,
  alt,
  className,
  width,
  height,
}: {
  src: string;
  alt: string;
  className?: string;
  width: number;
  height: number;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      unoptimized={src.startsWith("http")}
      className={className}
    />
  );
}

export default function ProductGallery({ images, name }: Props) {
  const displayImages =
    images.length > 0 ? images : ["/placeholder-product.svg"];

  const [activeImage, setActiveImage] = useState(displayImages[0]);

  return (
    <div>
      <ProductImage
        src={activeImage}
        alt={name}
        width={700}
        height={700}
        className="aspect-square w-full rounded-xl border object-cover"
      />

      {displayImages.length > 1 && (
        <div className="mt-4 flex gap-3">
          {displayImages.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveImage(image)}
              aria-label={`Show image ${index + 1} of ${name}`}
              aria-pressed={activeImage === image}
              className={`overflow-hidden rounded-lg border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                activeImage === image ? "ring-2 ring-blue-600" : ""
              }`}
            >
              <ProductImage
                src={image}
                alt={`${name} ${index + 1}`}
                width={80}
                height={80}
                className="h-20 w-20 object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
