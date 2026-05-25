import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineMail } from "react-icons/hi";
import { RiFileDownloadLine } from "react-icons/ri";
import HandsIcon from "./HandsIcon.jsx";
import Moradabad from "../../assets/images/About/Moradabad.jpg";
import part1 from "../../assets/images/About/part1.png";

function AboutSection() {
  const navigate = useNavigate();

  const images = [part1, part1, part1]; // Example images

  return (
    <section id="about" className="w-full bg-black text-white overflow-hidden">
      <div className="h-[30vh] sm:h-[35vh] md:h-[40vh] lg:h-[50vh] flex items-center justify-center">
        <h1
          className="font-JetBrainsMono font-extrabold tracking-tight
          text-[20vw] sm:text-[16vw] md:text-[14vw] lg:text-[12vw]
          leading-none"
        >
          about
        </h1>
      </div>
      <div
        className="
          min-h-screen
          flex flex-col
          lg:flex-row
          items-center
          justify-center
          gap-10
          px-6 sm:px-10 lg:px-20
          py-10 font-JetBrainsMono
        "
      >
        <div
          className="
  w-full lg:w-1/2
  text-center lg:text-left
  lg:translate-x-[15%]  /* Desktop par 15% right shift */
"
        >
          <h1
            className="
    text-[32px]
    sm:text-[38px]
    md:text-[42px]
    lg:text-[50px]
    font-semibold
    leading-tight
  "
          >
            Hi <HandsIcon size={42} /> I'm Vijay
            <br />I like building web applications.
          </h1>

          <p
            className="
    mt-4
    text-[14px] sm:text-[16px] md:text-[17px] 
    text-white/80 
    max-w-[90%] sm:max-w-xl lg:max-w-2xl 
    mx-auto lg:mx-0
    text-center sm:text-left
    leading-relaxed
  "
          >
            Passionate Web Developer and UI/UX Designer. I specialize in
            creating visually engaging, user-friendly, and responsive digital
            experiences. With a strong eye for design and a solid foundation in
            front-end technologies, I bring ideas to life by blending aesthetics
            with functionality. Whether it’s crafting seamless interfaces or
            building efficient web applications, I strive to deliver products
            that users love and businesses value.
          </p>

          {/* BTN */}
          <div
            className="
    mt-8
    flex
    flex-col
    sm:flex-row
    gap-4
    justify-center
    lg:justify-start
  "
          >
            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              href="/Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2
        bg-white text-black px-6 py-3 rounded-xl font-medium"
            >
              <RiFileDownloadLine size={22} />
              Resume
            </motion.a>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/book-discovery-call")}
              className="flex items-center justify-center gap-2
        border border-white px-6 py-3 rounded-xl font-medium"
            >
              <HiOutlineMail size={22} />
              Say Hi
            </motion.button>
          </div>
        </div>
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
              px-4 py-1.5
              rounded-full
              text-xs sm:text-sm font-JetBrainsMono
            "
            >
              Moradabad, Uttar Pradesh, India
            </div>
          </div>

          {/* SMALL IMAGES */}

          <div className="flex gap-3 sm:gap-4">
            {images.map((img, i) => (
              <div
                key={i}
                className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => {
                  if (i === images.length - 1) {
                    navigate("/gallery");
                  }
                }}
              >
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                {i === images.length - 1 && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-white font-semibold text-sm sm:text-base">
                      +1 More
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
