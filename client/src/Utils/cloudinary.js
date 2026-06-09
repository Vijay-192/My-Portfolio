export function optimizeUrl(url, opts = {}) {
  if (!url || !url.includes("cloudinary.com")) return url;

  const {
    width,             
    height,       
    quality = "auto",
    format = "auto",
    crop = "fill",
  } = opts;

  const transforms = [
    `f_${format}`,
    `q_${quality}`,
    width  ? `w_${width}`  : null,  
    height ? `h_${height}` : null,  
    `c_${crop}`,
  ]
    .filter(Boolean)
    .join(",");

  return url.replace("/upload/", `/upload/${transforms}/`);
}

export function buildSrcSet(url, widths = [400, 800, 1200]) {
  if (!url || !url.includes("cloudinary.com")) return undefined;
  return widths
    .map((w) => `${optimizeUrl(url, { width: w, quality: "auto", format: "auto" })} ${w}w`)
    .join(", ");
}