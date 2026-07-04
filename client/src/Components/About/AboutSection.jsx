import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { HiOutlineMail } from "react-icons/hi";
import { RiFileDownloadLine } from "react-icons/ri";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import HandsIcon from "./HandsIcon.jsx";
import Moradabad from "../../assets/images/About/Moradabad.jpg";
import part1 from "../../assets/images/About/part1.png";
import {
  fetchGallery,
  selectGallery,
  selectGalleryLoading,
} from "../../redux-store/GallerySlice.js";
import {
  fetchDocuments,
  selectResumes,
  selectResumeState,
} from "../../redux-store/ResumeSlice.js";

function ThumbImage({ src, alt, fallback, className = "" }) {
  const handleError = (e) => {
    if (e.target.src !== fallback) e.target.src = fallback;
  };
  return (
    <div
      className={`relative w-full h-full overflow-hidden
        bg-gradient-to-br from-zinc-800 to-zinc-950
        ring-1 ring-inset ring-white/10 ${className}`}
    >
      <img
        src={src}
        alt={alt}
        onError={handleError}
        className="relative w-full h-full object-contain
          transition-transform duration-500 hover:scale-105"
      />
    </div>
  );
}

function AboutSection() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const gallery = useSelector(selectGallery);
  const galleryLoading = useSelector(selectGalleryLoading);
  const resumes = useSelector(selectResumes);
  const resumeState = useSelector(selectResumeState);

  useEffect(() => {
    dispatch(fetchGallery());
    dispatch(fetchDocuments("resume"));
  }, [dispatch]);

  const activeResume = resumes?.find((r) => r.isActive) ?? resumes?.[0] ?? null;
  const resumeUrl = activeResume?.fileUrl || null;

  const handleResumeDownload = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "Vijay_Resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const getThumbUrl = (item) => {
    const img = item?.media?.find((m) => m.type === "image");
    return img?.url || part1;
  };

  const sortedGallery = gallery?.length ? [...gallery].reverse() : [];
  const previewItems = sortedGallery.slice(0, 2);
  const totalCount = gallery?.length || 0;
  const remaining = totalCount > 2 ? totalCount - 2 : 0;

  return (
    <section id="about" className="w-full bg-black text-white overflow-hidden">
      {/* ── Big heading ── */}
      <div className="h-[30vh] sm:h-[35vh] md:h-[40vh] lg:h-[50vh] flex items-center justify-center">
        <h1 className="font-JetBrainsMono font-extrabold tracking-tight text-[20vw] sm:text-[16vw] md:text-[14vw] lg:text-[12vw] leading-none">
          about
        </h1>
      </div>

      {/* ── Main content ── */}
      <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center gap-10 px-6 sm:px-10 lg:px-20 py-10 font-JetBrainsMono">
        {/* ── LEFT — Text ── */}
        <div className="w-full lg:w-1/2 text-left lg:translate-x-[15%]">
          {/* Heading */}
          <h1 className="text-[26px] sm:text-[34px] md:text-[42px] lg:text-[48px] font-semibold leading-[1.2] tracking-tight">
            Hi <HandsIcon size={36} /> I'm Vijay Saini
            <br />
            <span className="text-white/60">I build</span> web apps
            <br />
            <span className="text-white/60">that</span> feel alive.
          </h1>

          {/* Description — short, punchy, scannable on mobile */}
          <div className="mt-5 space-y-2 text-[13px] sm:text-[14px] md:text-[15px] text-white/60 leading-relaxed max-w-sm sm:max-w-md lg:max-w-lg">
            <p>
              Passionate Web Developer and UI/UX Designer. I specialize in
              creating visually engaging, user-friendly, and responsive digital
              experiences. With a strong eye for design and a solid foundation
              in front-end technologies,
            </p>
            <p>
              I bring ideas to life by blending aesthetics with functionality.
              Whether it's crafting seamless interfaces or building efficient
              web applications, I strive to deliver products that users love and
              businesses value.
            </p>
          </div>

          {/* ── Buttons ── */}
          <div className="mt-8 flex flex-row gap-4 items-center flex-wrap">
            {/* Resume button */}
            {resumeState.loading ? (
              <SkeletonTheme baseColor="#161616" highlightColor="#262626">
                <Skeleton width={120} height={44} />
              </SkeletonTheme>
            ) : resumeUrl ? (
              <motion.button
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleResumeDownload(resumeUrl)}
                className="cursor-pointer group relative overflow-hidden border border-white/30 px-7 py-2.5 text-xs tracking-widest uppercase text-white transition-all duration-300 hover:border-white"
              >
                <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10 flex items-center gap-2 group-hover:text-black transition-colors duration-300">
                  <RiFileDownloadLine size={15} />
                  Resume
                </span>
              </motion.button>
            ) : (
              <button
                disabled
                className="border border-white/20 px-7 py-2.5 text-xs tracking-widest uppercase text-white/40 cursor-not-allowed opacity-50"
              >
                Resume
              </button>
            )}

            {/* Say Hi */}
            <button
              onClick={() => navigate("/book-discovery-call")}
              className="group inline-flex items-center gap-2
                text-white/70 hover:text-white
                font-medium text-sm tracking-wide
                relative py-2.5 transition-colors duration-200
                bg-transparent border-none cursor-pointer"
            >
              <HiOutlineMail size={16} />
              Say Hi
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                ↗
              </span>
              <span className="absolute bottom-0 left-0 h-px w-0 bg-white transition-[width] duration-300 ease-out group-hover:w-full" />
            </button>
          </div>
        </div>

        {/* ── RIGHT — Images ── */}
        <div className="w-full lg:w-1/2 flex flex-col items-center gap-6">
          {/* MAIN IMAGE */}
          <div className="relative overflow-hidden w-full max-w-[600px]">
            {galleryLoading ? (
              <SkeletonTheme baseColor="#161616" highlightColor="#262626">
                <Skeleton height={340} width="100%" />
              </SkeletonTheme>
            ) : (
              <>
                <img
                  src={Moradabad}
                  alt="Moradabad"
                  className="w-full h-auto object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute bottom-3 right-3 bg-white/20 backdrop-blur-xl px-4 py-1.5 text-xs sm:text-sm font-JetBrainsMono">
                  Moradabad, Uttar Pradesh, India
                </div>
              </>
            )}
          </div>

          {/* SMALL IMAGES */}
          <div className="flex gap-3 sm:gap-4">
            {galleryLoading ? (
              <SkeletonTheme baseColor="#161616" highlightColor="#262626">
                {[1, 2, 3].map((i) => (
                  <Skeleton
                    key={i}
                    width={96}
                    height={96}
                    className="sm:!w-[112px] sm:!h-[112px] md:!w-[128px] md:!h-[128px]"
                  />
                ))}
              </SkeletonTheme>
            ) : (
              <>
                {previewItems.map((item, i) => (
                  <div
                    key={item._id || i}
                    className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 overflow-hidden bg-white/5"
                  >
                    <ThumbImage
                      src={getThumbUrl(item)}
                      alt={item.title || "gallery"}
                      fallback={part1}
                    />
                  </div>
                ))}

                <div
                  className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 overflow-hidden cursor-pointer bg-white/5"
                  onClick={() => navigate("/gallery")}
                >
                  {sortedGallery[2] ? (
                    <ThumbImage
                      src={getThumbUrl(sortedGallery[2])}
                      alt="more"
                      fallback={part1}
                    />
                  ) : (
                    <div className="w-full h-full bg-white/10" />
                  )}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-white font-semibold text-sm sm:text-base">
                      {remaining > 0 ? `+${remaining} More` : "Gallery"}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
export default AboutSection;