import gsap from "gsap";
import React, { useRef, useEffect, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import Sphere from "./Sphere.jsx";
import CreativeText from "../../assets/images/About/text.png";

const SOCIAL_LINKS = [
  { name: "Dribbble",  url: "https://dribbble.com/vijay-rovo",                   external: true  },
  { name: "Instagram", url: "https://instagram.com/vijay_saini_192",              external: true  },
  { name: "LinkedIn",  url: "https://www.linkedin.com/in/vijay-saini-51310a238/", external: true  },
  { name: "GitHub",    url: "https://github.com/Vijay-192",                       external: true  },
  { name: "Contact",   url: "/contact",                                            external: false },
];

const NavItem = ({ item }) => {
  const linkClass = "group flex items-center gap-1 transition-colors hover:text-white";
  const arrowClass = "text-xs transition-transform duration-300 ease-out group-hover:translate-x-[4px] group-hover:-translate-y-[4px]";

  return item.external ? (
    <a href={item.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
      <span>{item.name}</span>
      <FiArrowUpRight className={arrowClass} />
    </a>
  ) : (
    <Link to={item.url} className={linkClass}>
      <span>{item.name}</span>
      <FiArrowUpRight className={arrowClass} />
    </Link>
  );
};

function Hero() {
  const sphereRef  = useRef(null);
  const textImgRef = useRef(null);
  const [time, setTime] = useState("");

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth  - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      gsap.to(sphereRef.current,  { x, y, duration: 0.6, ease: "power3.out" });
      gsap.to(textImgRef.current, { x: x * 0.6, y: y * 0.6, duration: 0.6, ease: "power3.out" });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const ist = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + 5.5 * 3600000);
      const h  = ist.getHours();
      const mm = ist.getMinutes().toString().padStart(2, "0");
      const ss = ist.getSeconds().toString().padStart(2, "0");
      const ms = ist.getMilliseconds().toString().padStart(3, "0");
      setTime(`${((h + 11) % 12) + 1}:${mm}:${ss}.${ms} ${h >= 12 ? "p.m." : "a.m."}`);
    };
    tick();
    const id = setInterval(tick, 100);
    return () => clearInterval(id);
  }, []);

  return (
    <div id="home" className="w-full bg-black text-white relative font-sans overflow-hidden">

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04),transparent_70%)]" />

      <div className="lg:hidden min-h-screen flex flex-col">

        <div className="flex items-start justify-between px-5 pt-5">
          <div className="uppercase font-semibold leading-tight font-JetBrainsMono text-xs flex-shrink-0">
            Vijay<br />Saini
          </div>

          <div className="text-center font-JetBrainsMono flex-1 px-2">
            <div className="text-[9px] text-gray-400 opacity-70 tracking-widest uppercase mb-0.5">
              Available for freelance
            </div>
            <a href="https://bit.ly/49eE0vf" target="_blank" rel="noopener noreferrer"
              className="text-white text-[10px] font-semibold underline underline-offset-2 hover:text-gray-200 transition-colors">
              @rrovo0651
            </a>
          </div>

          <div className="text-gray-300 leading-5 font-JetBrainsMono text-[9px] text-right flex-shrink-0">
            <div className="text-white mb-0.5">Web Development</div>
            React, Next.js<br />
            Node.js, Three.js<br />
            GSAP, REST APIs
          </div>
        </div>

        <div className="flex justify-center mt-4 px-6">
          <img
            src={CreativeText}
            alt="Creative Developer"
            className="w-full max-w-[260px] sm:max-w-[320px] object-contain select-none pointer-events-none"
          />
        </div>

        <div className="flex justify-center mt-2">
          <Sphere ref={sphereRef} />
        </div>

        <div className="flex flex-col items-center text-center px-6 mt-5 gap-3">
          <p className="font-JetBrainsMono text-[13px] sm:text-sm leading-6 text-gray-300">
            Hi! I&apos;m <span className="text-white font-semibold">Vijay Saini</span>,
            a India-based{" "}
            <span className="text-white">creative web developer</span> and{" "}
            <span className="text-white">web designer</span>.
          </p>
          <p className="font-JetBrainsMono text-[11px] sm:text-xs leading-5 text-gray-400 max-w-[300px]">
            Backend roots, frontend vision — modern 3D experiences that are
            visually engaging and performance-focused.
          </p>
        </div>

        <div className="flex-1" />

        <div className="px-5 pb-6 pt-4 -mt-[15vh]">
          <nav className="flex justify-center mb-4" aria-label="Social links">
            <ul className="flex flex-row flex-wrap justify-center gap-x-3 gap-y-1 text-[10px] text-gray-400 font-JetBrainsMono">
              {SOCIAL_LINKS.map((item) => (
                <li key={item.name}>
                  <NavItem item={item} />
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-end justify-between">
            <div className="text-[9px] text-gray-400 leading-5 font-JetBrainsMono">
              <div>Local time</div>
              <div className="text-white tabular-nums">IST {time}</div>
            </div>
            <div className="text-[9px] font-JetBrainsMono text-gray-400 text-right">
              ©2026<br />
              <span className="text-white text-[11px]">V.S</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block min-h-screen relative">

        <header className="absolute top-0 left-0 right-0 z-20 px-12 pt-10">
          <div className="grid grid-cols-3 items-start">
            <div className="uppercase font-semibold leading-tight font-JetBrainsMono text-sm xl:text-base">
              Vijay<br />Saini
            </div>

            <div className="text-center font-JetBrainsMono text-sm text-gray-300">
              <div className="opacity-70 tracking-wide">Available for freelance:</div>
              <a href="https://bit.ly/49eE0vf" target="_blank" rel="noopener noreferrer"
                className="text-white font-semibold underline underline-offset-2 hover:text-gray-200 transition-colors">
                @rrovo0651
              </a>
            </div>

            <div className="text-gray-300 leading-6 font-JetBrainsMono text-[13px] xl:text-[14px] text-right">
              <div className="text-white mb-1">Web Development</div>
              JavaScript, React<br />
              Next.js, Node.js,<br />
              Express, Three.js, Gsap<br />
              REST APIs, Mongoose
            </div>
          </div>
        </header>

        <main className="flex items-center justify-center h-screen px-12">
          <div className="w-1/3 flex items-center justify-center">
            <img
              ref={textImgRef}
              src={CreativeText}
              alt="Creative Developer"
              className="w-full max-w-[720px] object-contain select-none pointer-events-none relative bottom-40 left-16"
            />
          </div>

          <div className="w-1/3 flex items-center justify-center">
            <Sphere ref={sphereRef} />
          </div>

          <div className="w-1/3 flex flex-col justify-center px-8 gap-4">
            <p className="font-JetBrainsMono text-[17px] leading-7 text-gray-300">
              Hi! I&apos;m <span className="text-white">Vijay Saini</span>, a India-based{" "}
              <span className="text-white">creative web developer</span> and{" "}
              <span className="text-white">web designer</span>.
            </p>
            <p className="font-JetBrainsMono text-[15px] leading-6 text-gray-400">
              My background in backend development shapes my approach,
              <span className="text-white"> allowing me to create cool,</span>{" "}
              modern 3D experiences on the frontend. This drives me toward
              building visually engaging and performance-focused web solutions.
            </p>
          </div>
        </main>

        <footer className="absolute bottom-0 left-0 right-0 z-20 px-12 pb-5 flex items-end justify-between">
          <div className="text-[11px] text-gray-400 leading-5 font-JetBrainsMono">
            <div>Local time</div>
            <div className="text-white tabular-nums">IST {time}</div>
          </div>

          <nav className="absolute left-1/2 -translate-x-1/2 bottom-5" aria-label="Social links">
            <ul className="flex flex-row gap-3 text-[11px] text-gray-400 font-JetBrainsMono">
              {SOCIAL_LINKS.map((item) => (
                <li key={item.name}>
                  <NavItem item={item} />
                </li>
              ))}
            </ul>
          </nav>

          <div className="text-[11px] font-JetBrainsMono text-gray-400 text-right">
            ©2026<br />
            <span className="text-white text-sm">V.S</span>
          </div>
        </footer>
      </div>

    </div>
  );
}

export default Hero;