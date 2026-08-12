/// <reference types="vite/client" />
/* eslint-disable @next/next/no-img-element -- GitHub Pages needs a static image shim. */

import type { CSSProperties, ImgHTMLAttributes } from "react";

type StaticImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt"
> & {
  src: string | { src: string };
  alt: string;
  fill?: boolean;
  priority?: boolean;
};

export default function StaticImage({
  src,
  alt,
  fill = false,
  priority = false,
  style,
  ...props
}: StaticImageProps) {
  const rawSource = typeof src === "string" ? src : src.src;
  const resolvedSource = rawSource.startsWith("/")
    ? `${import.meta.env.BASE_URL}${rawSource.slice(1)}`
    : rawSource;
  const fillStyle: CSSProperties | undefined = fill
    ? {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        ...style,
      }
    : style;

  return (
    <img
      {...props}
      src={resolvedSource}
      alt={alt}
      loading={priority ? "eager" : props.loading}
      fetchPriority={priority ? "high" : props.fetchPriority}
      style={fillStyle}
    />
  );
}
