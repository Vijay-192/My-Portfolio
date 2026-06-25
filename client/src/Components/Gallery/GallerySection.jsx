import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  fetchGallery,
  selectGallery,
  selectGalleryLoading,
  selectGalleryError,
  clearGalleryError,
} from "../../redux-store/GallerySlice";

const hasVideo = (item) => item?.media?.some((m) => m.type === "video");

function CardMedia({ item }) {
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  const media = item?.media || [];
  const total = media.length;
  const current = media[index];

  const go = (dir, e) => {
    e.stopPropagation();
    setFailed(false);
    setIndex((i) => (i + dir + total) % total);
  };

  if (!current || failed)
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 gap-2">
        <svg className="w-10 h-10 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.2" />
          <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="1.2" />
          <path d="M21 15l-5-5L5 21" strokeWidth="1.2" />
        </svg>
        <span className="text-xs text-zinc-500">No media</span>
      </div>
    );

  const isVideoOnly = !item?.media?.find((m) => m.type === "image") && hasVideo(item);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {current.type === "video" ? (
        <video
          src={current.url}
          className="w-full h-full object-contain"
          muted loop playsInline
          onMouseOver={(e) => e.currentTarget.play()}
          onMouseOut={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
          onError={() => setFailed(true)}
        />
      ) : (
        <img
          src={current.url}
          alt={item?.title || "gallery"}
          onError={() => setFailed(true)}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      )}

      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-300 pointer-events-none" />

      {isVideoOnly && (
        <span className="absolute bottom-3 left-3 bg-white/10 text-white text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/20">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          Video
        </span>
      )}

      {total > 1 && (
        <>
          <span className="absolute bottom-3 right-3 bg-white/10 text-white text-[10px] px-2.5 py-1 rounded-full tabular-nums border border-white/20">
            {index + 1}/{total}
          </span>

          {[{ dir: -1, side: "left-2", Icon: ChevronLeft, label: "Previous" },
            { dir: 1, side: "right-2", Icon: ChevronRight, label: "Next" }].map(({ dir, side, Icon, label }) => (
            <button
              key={label}
              type="button"
              onClick={(e) => go(dir, e)}
              aria-label={label}
              className={`absolute ${side} top-1/2 -translate-y-1/2 w-7 h-7 rounded-full
                bg-white/10 hover:bg-white text-white hover:text-black flex items-center justify-center
                border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer`}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {media.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => { e.stopPropagation(); setFailed(false); setIndex(i); }}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  i === index ? "w-4 bg-white" : "w-1.5 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function GalleryCard({ item, imgHeight = "h-56", className = "" }) {
  return (
    <div className={`group bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden
      hover:border-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.06)]
      transition-all duration-300 cursor-pointer ${className}`}>
      <div className={`relative w-full ${imgHeight} overflow-hidden bg-zinc-900`}>
        <CardMedia item={item} />
        {item?.isFeatured && (
          <span className="absolute top-3 left-3 bg-white text-black text-[10px] font-semibold tracking-wider px-3 py-1 rounded-full z-10">
            ★ Featured
          </span>
        )}
      </div>

      <div className="p-4 border-t border-zinc-800">
        {item?.category && (
          <span className="inline-block text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full mb-2 bg-white/5 text-zinc-400 border border-white/10">
            {item.category}
          </span>
        )}
        <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 mb-1 group-hover:text-zinc-200 transition-colors duration-200">
          {item?.title || "Untitled"}
        </h3>
        {item?.description && (
          <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{item.description}</p>
        )}
        {item?.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2.5">
            {item.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] bg-zinc-900 text-zinc-500 border border-zinc-700 px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}
        {item?.createdAt && (
          <p className="mt-3 text-[11px] text-zinc-600">
            {new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        )}
      </div>
    </div>
  );
}

function GallerySkeleton() {
  return (
    <div className="min-h-screen bg-black px-4 md:px-10 py-8">
      <div className="h-9 w-24 bg-zinc-900 rounded-full animate-pulse mb-8" />
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10 space-y-3">
          <div className="h-4 w-24 bg-zinc-900 rounded-full animate-pulse" />
          <div className="h-10 w-56 bg-zinc-900 rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="col-span-2 bg-zinc-900 rounded-2xl animate-pulse h-80" />
          <div className="col-span-1 bg-zinc-900 rounded-2xl animate-pulse h-80" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => <div key={i} className="bg-zinc-900 rounded-2xl animate-pulse h-60" />)}
        </div>
      </div>
    </div>
  );
}

function GallerySection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const gallery = useSelector(selectGallery);
  const loading = useSelector(selectGalleryLoading);
  const error = useSelector(selectGalleryError);

  useEffect(() => {
    dispatch(fetchGallery());
    return () => dispatch(clearGalleryError());
  }, [dispatch]);

  if (loading) return <GallerySkeleton />;

  if (error)
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 px-4">
        <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
            <path d="M12 8v4m0 4h.01" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <p className="text-sm text-zinc-400 text-center max-w-xs">{error}</p>
        <button
          onClick={() => dispatch(fetchGallery())}
          className="text-sm border border-zinc-700 text-zinc-300 px-5 py-2 rounded-full hover:border-white hover:text-white transition-colors cursor-pointer"
        >
          Try again
        </button>
      </div>
    );

  if (!gallery?.length)
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-3">
        <svg className="w-14 h-14 text-zinc-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.2" />
          <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="1.2" />
          <path d="M21 15l-5-5L5 21" strokeWidth="1.2" />
        </svg>
        <p className="text-sm text-zinc-600">Abhi koi gallery item nahi hai.</p>
        <button onClick={() => navigate(-1)} className="mt-2 text-sm text-zinc-500 hover:text-white transition-colors cursor-pointer">
          ← Back
        </button>
      </div>
    );

  const grouped = gallery.reduce((acc, item) => {
    const cat = item?.category?.trim() || "General";
    (acc[cat] = acc[cat] || []).push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-black">
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-zinc-800/50 px-4 md:px-10 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group cursor-pointer"
        >
          <span className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center group-hover:border-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M19 12H5M12 5l-7 7 7 7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          Back
        </button>
      </div>

      <div className="px-4 md:px-10 py-10 max-w-7xl mx-auto">
        <div className="mb-10">
          <span className="inline-block text-[11px] uppercase tracking-widest font-medium text-zinc-500 border border-zinc-800 rounded-full px-3 py-1 mb-3">
            Collection
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Our <span className="text-white underline underline-offset-4 decoration-zinc-600">Gallery</span>
          </h1>
        </div>

        {Object.entries(grouped).map(([category, catItems], catIdx) => {
          const [hero, tall, ...rest] = catItems;
          return (
            <div key={category} className={catIdx > 0 ? "mt-12" : ""}>
              <div className="flex items-center gap-3 mb-5">
                <span className="inline-block text-[11px] uppercase tracking-widest font-semibold text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1 capitalize">
                  {category}
                </span>
                <div className="h-px flex-1 bg-zinc-800" />
              </div>

              {(hero || tall) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  {hero && <GalleryCard item={hero} imgHeight="h-80" className="md:col-span-2" />}
                  {tall && <GalleryCard item={tall} imgHeight="h-80" className="md:col-span-1" />}
                </div>
              )}

              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {rest.map((item) => <GalleryCard key={item._id} item={item} imgHeight="h-56" />)}
                </div>
              )}
            </div>
          );
        })}

        <div className="h-16" />
      </div>
    </div>
  );
}

export default GallerySection;