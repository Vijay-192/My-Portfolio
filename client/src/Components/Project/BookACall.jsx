import { useNavigate } from "react-router-dom";

const BookACall = () => {
  const navigate = useNavigate();

  return (
    <div className="h-main-screen">
      {/* ── CTA ── */}
      <div
        className="
          grid grid-rows-2 overflow-hidden
          bg-gradient-to-b from-[#2a2a2a] via-[#0a0a0a] to-black
          px-4 sm:px-6 lg:px-0 pt-20 sm:pt-16
        "
      >
        <div className="flex flex-col items-center justify-center">
          <h1
            className="
              font-JetBrainsMono font-bold
              text-[3.5rem] sm:text-[6rem] md:text-[10rem] lg:text-[12rem]
              leading-none tracking-tight
              bg-gradient-to-b from-white to-white/40
              bg-clip-text text-transparent
              text-center
            "
          >
            Book a Call
          </h1>

          <div
            className="
              flex flex-wrap justify-center
              gap-x-6 sm:gap-x-16 lg:gap-x-48
              gap-y-3
              text-[10px] sm:text-[12px] md:text-[13px]
              tracking-[0.3em] text-white/50
              font-JetBrainsMono font-extrabold
              mt-4 sm:mt-6
            "
          >
            <span>LET&apos;S CHAT</span>
            <span>LET&apos;S CHAT</span>
            <span>LET&apos;S CHAT</span>
            <span className="hidden sm:inline">LET&apos;S CHAT</span>
            <span className="hidden md:inline">LET&apos;S CHAT</span>
          </div>
        </div>

        {/* Button */}
        <div className="flex justify-center items-center sm:py-16 px-4">
          <button
            onClick={() => navigate("/book-discovery-call")}
            className="
              w-full sm:w-auto
              px-6 sm:px-16 md:px-32 lg:px-56
              py-4 sm:py-6 md:py-8 lg:py-10
              rounded-full
              bg-gradient-to-b from-white to-gray-300
              shadow-[0_0_0_6px_rgba(255,255,255,0.1)]
              text-black/90
              text-lg sm:text-2xl md:text-3xl lg:text-5xl
              font-JetBrainsMono font-semibold
              tracking-wide
              transition-all duration-300
              hover:scale-105
              hover:shadow-[0_0_0_8px_rgba(255,255,255,0.2)]
              cursor-pointer
            "
          >
            Book Discovery Call
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookACall;