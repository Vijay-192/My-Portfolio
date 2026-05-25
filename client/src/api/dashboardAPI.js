
const BASE_URL = import.meta.env.VITE_API_URL;

const get = async (path) => {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
};

export const fetchProjectsAPI     = () => get("/projects");
export const fetchSkillsAPI       = () => get("/skills");
export const fetchServicesAPI     = () => get("/services");
export const fetchAchievementsAPI = () => get("/achievements");
export const fetchBlogPostsAPI    = () => get("/blogs");   