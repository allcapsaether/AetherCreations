import { useState } from "react";
import { unsplash, unsplashSrcSet } from "../lib";

type Props = {
  photo: string;
  alt: string;
  sizes: string;
  widths?: readonly number[];
  /** Above-the-fold images load immediately and at high priority. */
  priority?: boolean;
};

/**
 * Responsive image with a graceful failure mode: if the photo can't load, the
 * element disappears and the container's own background shows instead of a
 * broken-image icon. Pass alt="" for purely decorative images.
 */
export default function Photo({ photo, alt, sizes, widths = [480, 800, 1200], priority = false }: Props) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <img
      src={unsplash(photo, widths[widths.length - 1])}
      srcSet={unsplashSrcSet(photo, widths)}
      sizes={sizes}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
