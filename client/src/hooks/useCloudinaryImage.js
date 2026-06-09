// hooks/useCloudinaryImage.js
import { useMemo } from "react";
import { optimizeUrl, buildSrcSet } from "../Utils/cloudinary.js";

export function useCloudinaryImage(rawUrl, opts = {}) {
  const { widths, ...imgOpts } = opts;

  const src = useMemo(
    () => optimizeUrl(rawUrl, imgOpts),
    [rawUrl, JSON.stringify(imgOpts)]
  );

  const srcSet = useMemo(
    () => buildSrcSet(rawUrl, widths),
    [rawUrl, widths]
  );

  return { src, srcSet };
}