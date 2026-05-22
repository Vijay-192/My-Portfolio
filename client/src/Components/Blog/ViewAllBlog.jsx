
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchAllBlogs,
  selectBlogs,
  selectBlogLoading,
} from "../../redux-store/BlogSlice";

const parseTags = (tags) => {
  const raw = Array.isArray(tags) ? tags.join(" ") : tags || "";
  return raw
    .split(/[\s,]+/)
    .map((t) => t.replace(/^#/, "").trim())
    .filter(Boolean);
};
const SkeletonSmall = () => (
  <article className="flex flex-col gap-3">
    <div className="w-full aspect-[4/3] rounded-2xl bg-gray-200 animate-pulse" />
    <div className="h-3 w-16 bg-gray-200 rounded-full animate-pulse" />
    <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
  </article>
);

const SkeletonFeatured = () => (
  <article className="flex flex-col gap-3 col-span-1 sm:col-span-2 lg:col-span-2 row-span-2">
    <div className="w-full aspect-[16/10] rounded-2xl bg-gray-200 animate-pulse min-h-[260px]" />
    <div className="h-3 w-24 bg-gray-200 rounded-full animate-pulse" />
    <div className="h-6 w-full bg-gray-200 rounded animate-pulse" />
    <div className="h-6 w-2/3 bg-gray-200 rounded animate-pulse" />
  </article>
);

const SmallCard = ({ blog, onClick }) => {
  const tags = parseTags(blog.tags);
  return (
    <article
      className="group cursor-pointer flex flex-col"
      onClick={onClick}
    >
      <div className="overflow-hidden rounded-2xl bg-gray-100 flex-shrink-0">
        {blog.coverImage ? (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full aspect-[4/3] object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full aspect-[4/3] flex items-center justify-center text-gray-400 text-xs font-medium tracking-wide">
            No Image
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-1 flex-1">
        <span className="text-xs font-semibold tracking-widest text-indigo-500 uppercase">
          {tags[0] ? `#${tags[0]}` : blog.category || "Blog"}
        </span>
        <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200">
          {blog.title}
        </h3>
        {blog.author && (
          <p className="text-xs text-gray-400 mt-auto pt-1">
            By {blog.author}
          </p>
        )}
      </div>
    </article>
  );
};
const FeaturedCard = ({ blog, onClick, isHero }) => {
  const tags = parseTags(blog.tags);
  return (
    <article
      className={`group cursor-pointer flex flex-col ${
        isHero
          ? "col-span-1 sm:col-span-2 lg:col-span-2 row-span-2"
          : "col-span-1 sm:col-span-2 row-span-2"
      }`}
      onClick={onClick}
    >
      <div className="overflow-hidden rounded-2xl bg-gray-100 flex-shrink-0">
        {blog.coverImage ? (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className={`w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
              isHero ? "aspect-[16/10] min-h-[200px] sm:min-h-[300px] lg:min-h-[380px]" : "aspect-[16/9]"
            }`}
          />
        ) : (
          <div
            className={`w-full flex items-center justify-center text-gray-400 text-sm font-medium ${
              isHero ? "aspect-[16/10] min-h-[200px] sm:min-h-[300px] lg:min-h-[380px]" : "aspect-[16/9]"
            }`}
          >
            No Image
          </div>
        )}
      </div>

      <div className="mt-3 sm:mt-4 flex flex-col gap-1.5 flex-1">
        <span className="text-xs font-semibold tracking-widest text-indigo-500 uppercase">
          {tags[0] ? `#${tags[0]}` : blog.category || "Blog"}
        </span>
        <h2
          className={`font-extrabold text-gray-900 leading-tight line-clamp-3 group-hover:text-indigo-600 transition-colors duration-200 ${
            isHero ? "text-xl sm:text-2xl lg:text-3xl" : "text-lg sm:text-xl"
          }`}
        >
          {blog.title}
        </h2>
        {blog.excerpt && (
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mt-1">
            {blog.excerpt}
          </p>
        )}
        {blog.author && (
          <p className="text-xs text-gray-400 mt-auto pt-1">
            By {blog.author}
          </p>
        )}
      </div>
    </article>
  );
};
const BackButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 bg-white border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-gray-300 hover:text-indigo-600 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
    aria-label="Go back"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
    Back
  </button>
);
const FEATURED_POSITIONS = new Set([0, 3]);
function ViewAllBlog() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allBlogs = useSelector(selectBlogs) ?? [];
  const loading = useSelector(selectBlogLoading);

  useEffect(() => {
    dispatch(fetchAllBlogs());
  }, [dispatch]);

  const goTo = (id) => navigate(`/view-blog/${id}`);
  const goBack = () => navigate(-1);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back button skeleton */}
        <div className="h-9 w-20 bg-gray-200 rounded-xl animate-pulse mb-8" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 auto-rows-auto">
          <SkeletonFeatured />
          <SkeletonSmall />
          <SkeletonSmall />
          <SkeletonSmall />
          <SkeletonSmall />
          <SkeletonFeatured />
          <SkeletonSmall />
          <SkeletonSmall />
        </div>
      </section>
    );
  }

  if (allBlogs.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton onClick={goBack} />
        <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-2">
          <svg
            className="w-12 h-12 mb-2 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-base font-semibold text-gray-500">No blogs found</p>
          <p className="text-sm">Add blogs from the dashboard to see them here.</p>
        </div>
      </section>
    );
  }
  const gridItems = allBlogs.map((blog, i) => {
    const posInGroup = i % 6;
    const isFeatured = FEATURED_POSITIONS.has(posInGroup);
    const isHero = i === 0; // very first card gets hero treatment
    return { blog, isFeatured, isHero };
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* ── Header Row ── */}
      <div className="flex items-center justify-between mb-8 sm:mb-10 gap-4">
        <BackButton onClick={goBack} />
        <div className="text-right">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 leading-tight">
            All Blogs
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            {allBlogs.length} article{allBlogs.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-7 auto-rows-auto items-start">
        {gridItems.map(({ blog, isFeatured, isHero }) =>
          isFeatured ? (
            <FeaturedCard
              key={blog._id}
              blog={blog}
              onClick={() => goTo(blog._id)}
              isHero={isHero}
            />
          ) : (
            <SmallCard
              key={blog._id}
              blog={blog}
              onClick={() => goTo(blog._id)}
            />
          )
        )}
      </div>
    </section>
  );
}

export default ViewAllBlog;