import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const CustomCursor = ({ visible, clicked }) => {
  const cursorRef = useRef(null);

  useEffect(() => {
    let rafId;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let lx = mx;
    let ly = my;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const loop = () => {
      lx += (mx - lx) * 0.09;
      ly += (my - ly) * 0.09;
      if (cursorRef.current) {
        cursorRef.current.style.left = `${lx}px`;
        cursorRef.current.style.top = `${ly}px`;
      }
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const cursor = (
    <div
      ref={cursorRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        transform: "translate(-50%, -50%)",
        zIndex: 999999,
        pointerEvents: "none",
        transition: [
          "opacity 0.25s ease",
          "width 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          "height 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        ].join(", "),
      }}
      className={`
        flex flex-col items-center justify-center rounded-full bg-white
        ${visible ? "opacity-100" : "opacity-0"}
        ${clicked ? "w-20 h-20" : "w-28 h-28"}
      `}
    >
      <span
        className="font-JetBrainsMono select-none text-black font-semibold leading-none tracking-widest uppercase"
        style={{ fontSize: "10px" }}
      >
        {clicked ? "opening" : "view"}
      </span>
      <span
        className="text-black mt-1 leading-none select-none"
        style={{
          fontSize: "13px",
          display: "inline-block",
          transition: "transform 0.25s ease",
          transform: clicked ? "rotate(45deg)" : "rotate(0deg)",
        }}
      >
        ↗
      </span>
    </div>
  );

  return createPortal(cursor, document.body);
};

export default CustomCursor;