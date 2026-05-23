import gsap from "gsap";
import React, { useRef, useEffect, useState } from "react";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { FiArrowUpRight } from "react-icons/fi";
import AboutSection from "../About/AboutSection.jsx";
import ServiceSection from "../Service/ServiceSection.jsx";
import ProjectSection from "../Project/ProjectSection.jsx";
import SkillSection from "../Skills/SkillSection.jsx";
import Education from "../Education/Education.jsx";
import BlogSection from "../Blog/BlogSection.jsx";
import Sphere from "./Sphere.jsx";
import CreativeText from "../../assets/images/About/text.png";
gsap.registerPlugin(ScrollToPlugin);

function HomeSection() {
  const sphereRef = useRef(null);
  const textImgRef = useRef(null);
  const [time, setTime] = useState("");

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;

      const x = (e.clientX / innerWidth - 0.5) * 30;
      const y = (e.clientY / innerHeight - 0.5) * 30;

      gsap.to(sphereRef.current, {
        x,
        y,
        duration: 0.6,
        ease: "power3.out",
      });

      gsap.to(textImgRef.current, {
        x: x * 0.6,
        y: y * 0.6,
        duration: 0.6,
        ease: "power3.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const istOffset = 5.5 * 60;
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const istTime = new Date(utc + istOffset * 60000);

      const hours = istTime.getHours();
      const minutes = istTime.getMinutes().toString().padStart(2, "0");
      const seconds = istTime.getSeconds().toString().padStart(2, "0");
      const milliseconds = istTime
        .getMilliseconds()
        .toString()
        .padStart(3, "0");
      const ampm = hours >= 12 ? "p.m." : "a.m.";
      const formattedHours = ((hours + 11) % 12) + 1;

      setTime(
        `${formattedHours}:${minutes}:${seconds}.${milliseconds} ${ampm}`,
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section>
        <div
          id="home"
          className="min-h-screen w-full bg-black text-white overflow-hidden relative font-sans"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04),transparent_70%)]" />

          <div
            className="absolute top-4 sm:top-8 md:top-10
  left-4 sm:left-6 md:left-12
  right-4 sm:right-6 md:right-12
  flex flex-col sm:flex-row justify-between items-start
  text-sm tracking-wide z-20 gap-4 sm:gap-0"
          >
            <div className="uppercase font-semibold leading-tight font-JetBrainsMono text-sm sm:text-base">
              Vijay
              <br />
              Saini
            </div>

            <div
              className="
    text-center
    font-JetBrainsMono
    text-[10px]
    sm:text-sm
    text-gray-300

    /* Mobile positioning */
    absolute
    left-1/2
    -translate-x-[23vw]

    /* Desktop reset */
    sm:static
    sm:translate-x-0
  "
            >
              <div className="opacity-70 tracking-wide">
                Available for freelance:
              </div>

              <a
                href="https://bit.ly/49eE0vf"
                target="_blank"
                rel="noopener noreferrer"
                className="
      relative
      text-white
      font-semibold
      underline
      underline-offset-2
      hover:text-gray-200
      transition-colors
    "
              >
                @rrovo0651
              </a>
            </div>

            <div
              className="
    text-gray-300
    leading-6
    font-JetBrainsMono
    text-[11px]
    sm:text-[14px]

    /* Mobile: right side */
    absolute
    right-0
    pr-[-3]
    text-right

    /* Desktop: reset */
    sm:static
    sm:text-left
  "
            >
              <div className="text-white mb-1">Web Development</div>
              JavaScript, React
              <br />
              Next.js, Node.js,
              <br />
              Express, Three.js, Gsap
              <br />
              REST APIs, Mongoose
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center h-screen px-4 sm:px-8 lg:px-12 gap-8 lg:gap-0">
            {/* LEFT IMAGE */}

            <div className="w-full lg:w-1/3 flex items-center justify-center relative">
              <img
                ref={textImgRef}
                src={CreativeText}
                alt="Creative Developer"
                className="
      w-full 
      max-w-[400px] sm:max-w-[600px] lg:max-w-[720px]
      object-contain select-none pointer-events-none
      relative
      -top-6 sm:-top-20     
      lg:bottom-40 lg:left-16    
      mb-10 lg:mb-0
    "
              />
            </div>

            {/* CENTER SPHERE */}
            <Sphere />

            {/* RIGHT DESCRIPTION */}
            <div
              className="
    w-full 
    lg:w-1/3 
    flex 
    flex-col 
    justify-center 
    text-gray-300 
    text-sm 
    sm:text-[17px] 
    leading-5 
    sm:leading-6 
    px-2 
    sm:px-4 
    lg:px-8
    -translate-y-[60%]
    sm:translate-y-0
  "
            >
              <p className="mb-4 font-JetBrainsMono">
                Hi! I&apos;m <span className="text-white">Vijay Saini</span>, a
                India-based{" "}
                <span className="text-white">creative web developer</span> and{" "}
                <span className="text-white">web designer</span>.
              </p>

              <p className="font-JetBrainsMono">
                My background in backend development shapes my approach,
                <span className="text-white">
                  {" "}
                  allowing me to create cool,
                </span>{" "}
                modern 3D experiences on the frontend. This drives me toward
                building visually engaging and performance-focused web
                solutions.
              </p>
            </div>
          </div>

          {/* timer */}

          <div
            className="
    absolute 
    bottom-10 
    left-4 
    sm:left-6 
    md:left-12 
    text-xs 
    text-gray-400 
    leading-6 
    font-JetBrainsMono
    -translate-y-[300%]
    sm:translate-y-0
  "
          >
            <div>Local time</div>
            <div className="text-white">IST {time}</div>
          </div>
          <nav
            className="
    absolute 
    bottom-3.5 
    left-1/3
    -translate-x-1/2 
    z-30
    -translate-y-[17vh]
    translate-x-[10px]
    sm:translate-x-0
    sm:translate-y-0
  "
          >
            <ul className="flex flex-row gap-2 text-[11px] sm:text-xs text-gray-400 font-JetBrainsMono">
              {[
                { name: "Dribbble", url: "https://dribbble.com/vijay-rovo" },
                {
                  name: "Instagram",
                  url: "https://instagram.com/vijay_saini_192",
                },
                {
                  name: "LinkedIn",
                  url: "https://www.linkedin.com/in/vijay-saini-51310a238/",
                },
                { name: "GitHub", url: "https://github.com/Vijay-192" },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1 transition-colors hover:text-white"
                  >
                    <span>{item.name}</span>
                    <FiArrowUpRight className="text-xs transition-transform duration-300 ease-out group-hover:translate-x-[4px] group-hover:-translate-y-[4px]" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="absolute bottom-10 right-4 sm:right-6 md:right-12 text-sm font-JetBrainsMono text-gray-400 text-right">
            ©2026
            <br />
            <span className="text-white font-JetBrainsMono text-[14px]">
              V.S
            </span>
          </div>
        </div>

        {/* OTHER SECTIONS */}
        <AboutSection id="about" />
        <section id="skills">
          <SkillSection />
        </section>

        <section id="education">
          <Education />
        </section>

        <section id="services">
          <ServiceSection />
        </section>
        <section id="work">
          <ProjectSection />
        </section>
        <section id="blogs">
          <BlogSection />
        </section>
      </section>
    </>
  );
}

export default HomeSection;
