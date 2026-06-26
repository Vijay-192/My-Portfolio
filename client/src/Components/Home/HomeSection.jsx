import React from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import Hero from "./Hero.jsx";
import AboutSection from "../About/AboutSection.jsx";
import SkillSection from "../Skills/SkillSection.jsx";
import Education from "../Education/Education.jsx";
import ServiceSection from "../Service/ServiceSection.jsx";
import ProjectSection from "../Project/ProjectSection.jsx";
import BlogSection from "../Blog/BlogSection.jsx";

gsap.registerPlugin(ScrollToPlugin);

function Home() {
  return (
    <main>
      {/* ── Hero / Landing ── */}
      <Hero />

      {/* ── About ── */}
      <section id="about">
        <AboutSection />
      </section>

      {/* ── Skills ── */}
      <section id="skills">
        <SkillSection />
      </section>

      {/* ── Education ── */}
      <section id="education">
        <Education />
      </section>

      {/* ── Services ── */}
      <section id="services">
        <ServiceSection />
      </section>

      {/* ── Work / Projects ── */}
      <section id="work">
        <ProjectSection />
      </section>

      {/* ── Blogs ── */}
      <section id="blogs">
        <BlogSection />
      </section>
    </main>
  );
}

export default Home;