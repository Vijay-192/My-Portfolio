import React, { useEffect, useRef } from "react";
import gsap from "gsap";

  

function HandsIcon({ size = 50 }) {

    const handRef = useRef(null);

  useEffect(() => {
    gsap.to(handRef.current, {
      rotate: 20,
      duration: 0.4,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
    });
  }, []);

  return (

    <>
 <span
      ref={handRef}
      className="inline-block ml-2"
      style={{ fontSize: size }}
    >
      👋
    </span>
    </>
  )
}

export default HandsIcon