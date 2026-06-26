import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { HiOutlineMail } from "react-icons/hi";
import { RiFileDownloadLine } from "react-icons/ri";
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
      <div className="h-[30vh] sm:h-[35vh] md:h-[40vh] lg:h-[50vh] flex items-center justify-center">
        <h1 className="font-JetBrainsMono font-extrabold tracking-tight text-[20vw] sm:text-[16vw] md:text-[14vw] lg:text-[12vw] leading-none">
  about
</h1>
      </div>

      {/* ── Main content ── */}
      <div
        className="
          min-h-screen flex flex-col lg:flex-row
          items-center justify-center
          gap-10 px-6 sm:px-10 lg:px-20
          py-10 font-JetBrainsMono
        "
      >
        {/* ── LEFT — Text ── */}
        <div className="w-full lg:w-1/2 text-center lg:text-left lg:translate-x-[15%]">
          <h1
            className="
              text-[32px] sm:text-[38px] md:text-[42px] lg:text-[50px]
              font-semibold leading-tight
            "
          >
            Hi <HandsIcon size={42} /> I'm Vijay Saini
            <br />I like building web applications.
          </h1>

          <p
            className="
              mt-4 text-[14px] sm:text-[16px] md:text-[17px]
              text-white/80 max-w-[90%] sm:max-w-xl lg:max-w-2xl
              mx-auto lg:mx-0 text-center sm:text-left leading-relaxed
            "
          >
            Passionate Web Developer and UI/UX Designer. I specialize in
            creating visually engaging, user-friendly, and responsive digital
            experiences. With a strong eye for design and a solid foundation in
            front-end technologies, I bring ideas to life by blending aesthetics
            with functionality. Whether it's crafting seamless interfaces or
            building efficient web applications, I strive to deliver products
            that users love and businesses value.
          </p>

          {/* ── Buttons ── */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            {/* Resume button */}
            {resumeState.loading ? (
              <div className="h-12 w-36 bg-white/10 animate-pulse rounded-xl" />
            ) : resumeUrl ? (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleResumeDownload(resumeUrl)}
                className="flex items-center justify-center gap-2
                  bg-white text-black px-6 py-3 rounded-xl font-medium
                  cursor-pointer select-none"
              >
                <RiFileDownloadLine size={22} />
                Resume
              </motion.button>
            ) : (
              <motion.button
                disabled
                className="flex items-center justify-center gap-2
                  bg-white/20 text-white/40 px-6 py-3 rounded-xl font-medium
                  cursor-not-allowed opacity-50"
              >
                <RiFileDownloadLine size={22} />
                Resume
              </motion.button>
            )}

            {/* Say Hi button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/book-discovery-call")}
              className="flex items-center justify-center gap-2
                border border-white px-6 py-3 rounded-xl font-medium
                cursor-pointer"
            >
              <HiOutlineMail size={22} />
              Say Hi
            </motion.button>
          </div>
          
        </div>

        {/* ── RIGHT — Images ── */}
        <div className="w-full lg:w-1/2 flex flex-col items-center gap-6">
          {/* MAIN IMAGE */}
          <div className="relative overflow-hidden rounded-2xl w-full max-w-[600px]">
            <img
              src={Moradabad}
              alt="Moradabad"
              className="w-full h-auto object-cover
                transition-transform duration-500 hover:scale-110"
            />
            <div
              className="
                absolute bottom-3 right-3
                bg-white/20 backdrop-blur-xl
                px-4 py-1.5 rounded-full
                text-xs sm:text-sm font-JetBrainsMono
              "
            >
              Moradabad, Uttar Pradesh, India
            </div>
          </div>

          {/* SMALL IMAGES */}
          <div className="flex gap-3 sm:gap-4">
            {galleryLoading
              ? [1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32
                      rounded-2xl bg-white/10 animate-pulse"
                  />
                ))
              : previewItems.map((item, i) => (
                  <div
                    key={item._id || i}
                    className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32
                      rounded-2xl overflow-hidden bg-white/5"
                  >
                    <ThumbImage
                      src={getThumbUrl(item)}
                      alt={item.title || "gallery"}
                      fallback={part1}
                    />
                  </div>
                ))}

            <div
              className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32
                rounded-2xl overflow-hidden cursor-pointer bg-white/5"
              onClick={() => navigate("/gallery")}
            >
              {galleryLoading ? (
                <div className="w-full h-full bg-white/10 animate-pulse" />
              ) : sortedGallery[2] ? (
                <ThumbImage
                  src={getThumbUrl(sortedGallery[2])}
                  alt="more"
                  fallback={part1}
                />
              ) : (
                <div className="w-full h-full bg-white/10" />
              )}

              {!galleryLoading && (
                <div
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm
                  flex items-center justify-center"
                >
                  <span className="text-white font-semibold text-sm sm:text-base">
                    {remaining > 0 ? `+${remaining} More` : "Gallery"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;