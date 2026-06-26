import { FiArrowUpRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDocuments,
  selectResumes,
  selectCVs,
  selectResumeState,
  selectCVState,
} from "../../redux-store/ResumeSlice.js";

const API = import.meta.env.VITE_API_BASE_URL;

const externalLinks = [
  { name: "Dribbble",  url: "https://dribbble.com/vijay-rovo" },
  { name: "Instagram", url: "https://instagram.com/vijay_saini_192" },
  { name: "LinkedIn",  url: "https://www.linkedin.com/in/vijay-saini-51310a238/" },
  { name: "GitHub",    url: "https://github.com/Vijay-192" },
];
const internalLinks = [
  { name: "Admin Panel", url: "/dashboard" },
  { name: "Work",        url: "/work" },
  { name: "About",       url: "/about" },
  { name: "Services",    url: "/services" },
  { name: "Blogs",       url: "/blog" },
  { name: "Skills",      url: "/skills" },
  { name: "Contact",     url: "/contact" },
];

const handleDownload = (id, type) => {
  window.open(`${API}/${type}/${id}/download`, "_blank");
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "instant" });
};

function Footer() {
  const dispatch    = useDispatch();
  const resumes     = useSelector(selectResumes);
  const resumeState = useSelector(selectResumeState);
  const cvs         = useSelector(selectCVs);
  const cvState     = useSelector(selectCVState);

  useEffect(() => {
    dispatch(fetchDocuments("resume"));
    dispatch(fetchDocuments("cv"));
  }, [dispatch]);

  const activeResume = resumes?.find((r) => r.isActive) ?? resumes?.[0] ?? null;
  const activeCV     = cvs?.find((c) => c.isActive)    ?? cvs?.[0]    ?? null;
  const isLoading    = resumeState.loading || cvState.loading;

  return (
    <footer
      style={{ "--mobile-nav-h": "72px" }}
      className="bg-black text-white px-6 md:px-16 pt-16 md:pt-24 pb-[calc(var(--mobile-nav-h)+env(safe-area-inset-bottom)+1.5rem)] md:pb-16 font-JetBrainsMono"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-12 border-b border-gray-800">

          <div className="lg:col-span-7 space-y-8">
            <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl leading-tight max-w-2xl">
              Designing digital experiences that feel intuitive and delightful.
            </h2>
            <div className="max-w-md">
              <Link
                to="/book-discovery-call"
                onClick={scrollToTop}
                className="group inline-flex items-center gap-2 text-sm text-gray-300 border border-gray-700 rounded-full px-6 py-3 hover:border-gray-400 hover:text-white transition-colors"
              >
                <span>Book a Discovery Call</span>
                <FiArrowUpRight className="text-xs opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-10 sm:gap-10">

            <div>
              <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">Navigation</h3>
              <ul className="flex flex-col gap-3">
                {internalLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.url}
                      onClick={scrollToTop}
                      className="group flex items-center gap-2 text-sm text-gray-300 transition-colors hover:text-white"
                    >
                      <span>{item.name}</span>
                      <FiArrowUpRight className="text-xs opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:-translate-y-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">Connect</h3>
              <ul className="flex flex-col gap-3">
                {externalLinks.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 text-sm text-gray-300 transition-colors hover:text-white"
                    >
                      <span>{item.name}</span>
                      <FiArrowUpRight className="text-xs opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:-translate-y-0.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">Resume / CV</h3>

              {isLoading ? (
                <div className="flex flex-row sm:flex-col gap-3">
                  <div className="h-4 w-16 bg-white/10 animate-pulse rounded" />
                  <div className="h-4 w-10 bg-white/10 animate-pulse rounded" />
                </div>
              ) : (
                <ul className="flex flex-row sm:flex-col gap-6 sm:gap-3">
                  <li>
                    {activeResume ? (
                      <button
                        onClick={() => handleDownload(activeResume._id, "resume")}
                        className="group flex items-center gap-2 text-sm text-gray-300 transition-colors hover:text-white cursor-pointer"
                      >
                        <span>Resume</span>
                        <FiArrowUpRight className="text-xs opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:-translate-y-0.5" />
                      </button>
                    ) : (
                      <span className="text-sm text-gray-600 cursor-not-allowed">Resume</span>
                    )}
                  </li>
                  <li>
                    {activeCV ? (
                      <button
                        onClick={() => handleDownload(activeCV._id, "cv")}
                        className="group flex items-center gap-2 text-sm text-gray-300 transition-colors hover:text-white cursor-pointer"
                      >
                        <span>CV</span>
                        <FiArrowUpRight className="text-xs opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:-translate-y-0.5" />
                      </button>
                    ) : (
                      <span className="text-sm text-gray-600 cursor-not-allowed">CV</span>
                    )}
                  </li>
                </ul>
              )}
            </div>

          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center gap-x-4 gap-y-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Vijay Saini. All rights reserved.</p>
          <div className="flex gap-8">
            <Link to="/privacy-policy" onClick={scrollToTop} className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-use" onClick={scrollToTop} className="hover:text-gray-300 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;