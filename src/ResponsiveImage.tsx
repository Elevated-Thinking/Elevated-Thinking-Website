import { imageSrcSet, type ResponsiveImageAsset } from "./imageAssets";

export function ResponsiveImage({
  image,
  sizes,
  eager = false,
  className = "",
}: {
  image: ResponsiveImageAsset;
  sizes: string;
  eager?: boolean;
  className?: string;
}) {
  return (
    <picture>
      <source
        sizes={sizes}
        srcSet={imageSrcSet(image.sources.avif)}
        type="image/avif"
      />
      <source
        sizes={sizes}
        srcSet={imageSrcSet(image.sources.webp)}
        type="image/webp"
      />
      <img
        alt={image.alt}
        className={`h-full w-full object-cover ${className}`}
        decoding="async"
        fetchPriority={eager ? "high" : "auto"}
        height={image.height}
        loading={eager ? "eager" : "lazy"}
        sizes={sizes}
        src={image.sources.jpg[1].src}
        srcSet={imageSrcSet(image.sources.jpg)}
        style={{ objectPosition: image.position }}
        width={image.width}
      />
    </picture>
  );
}
