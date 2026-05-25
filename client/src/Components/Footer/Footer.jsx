// import { FiArrowUpRight } from "react-icons/fi";
// import { Link } from "react-router-dom";

// const externalLinks = [
//   { name: "Dribbble", url: "https://dribbble.com/vijay-rovo" },
//   { name: "Instagram", url: "https://instagram.com/vijay_saini_192" },
//   { name: "LinkedIn", url: "https://www.linkedin.com/in/vijay-saini-51310a238/" },
//   { name: "GitHub", url: "https://github.com/Vijay-192" },
// ];

// const internalLinks = [
//   { name: "Admin Panel", url: "/dashboard" },
//   { name: "Projects", url: "/work" },
//   { name: "About", url: "/about" },
// ];

// function Footer() {
//   return (
//     <footer className="bg-black text-white px-6 md:px-16 py-16 md:py-24 font-JetBrainsMono">
//       <div className="max-w-7xl mx-auto">

//         {/* Main Content Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-12 border-b border-gray-800">

//           {/* Left: Heading + Book Call */}
//           <div className="lg:col-span-7 space-y-8">
//             <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl leading-tight max-w-2xl">
//               Designing digital experiences that feel intuitive and delightful.
//             </h2>

//             {/* Work With Me — Book Call pill button */}
//             <div className="max-w-md">
            
//               <Link
//                 to="/book-discovery-call"
//                 className="group inline-flex items-center gap-2 text-sm text-gray-300 border border-gray-700 rounded-full px-6 py-3 hover:border-gray-400 hover:text-white transition-colors"
//               >
//                 <span>Book a Discovery Call</span>
//                 <FiArrowUpRight className="text-xs opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:-translate-y-0.5" />
//               </Link>
//             </div>
//           </div>

//           {/* Right: Links Grid — 3 columns */}
//           <div className="lg:col-span-5 grid grid-cols-3 gap-8 sm:gap-10">

//             {/* Navigation */}
//             <div>
//               <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">
//                 Navigation
//               </h3>
//               <ul className="flex flex-col gap-3">
//                 {internalLinks.map((item) => (
//                   <li key={item.name}>
//                     <Link
//                       to={item.url}
//                       className="group flex items-center gap-2 text-sm text-gray-300 transition-colors hover:text-white"
//                     >
//                       <span>{item.name}</span>
//                       <FiArrowUpRight className="text-xs opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:-translate-y-0.5" />
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Connect */}
//             <div>
//               <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">
//                 Connect
//               </h3>
//               <ul className="flex flex-col gap-3">
//                 {externalLinks.map((item) => (
//                   <li key={item.name}>
//                     <a
//                       href={item.url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="group flex items-center gap-2 text-sm text-gray-300 transition-colors hover:text-white"
//                     >
//                       <span>{item.name}</span>
//                       <FiArrowUpRight className="text-xs opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:-translate-y-0.5" />
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Resume / CV */}
//         <div>
//   <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">
//     Resume / CV
//   </h3>

//   <ul className="flex flex-col gap-3">
//     <li>
//       <a
//         href="/resume.pdf"
//         download
//         className="group flex items-center gap-2 text-sm text-gray-300 transition-colors hover:text-white"
//       >
//         <span> Resume</span>
//         <FiArrowUpRight className="text-xs opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:-translate-y-0.5" />
//       </a>
//     </li>

//     <li>
//       <a
//         href="/cv.pdf"
//         download
//         className="group flex items-center gap-2 text-sm text-gray-300 transition-colors hover:text-white"
//       >
//         <span> CV</span>
//         <FiArrowUpRight className="text-xs opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:-translate-y-0.5" />
//       </a>
//     </li>
//   </ul>
// </div>

//           </div>
//         </div>

//         {/* Bottom: Copyright / Legal */}
//         <div className="pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-gray-500">
//           <p>© {new Date().getFullYear()} Vijay Saini. All rights reserved.</p>
//           <div className="flex gap-6">
//             <Link to="/privacy" className="hover:text-gray-300 transition-colors">
//               Privacy Policy
//             </Link>
//             <Link to="/terms" className="hover:text-gray-300 transition-colors">
//               Terms
//             </Link>
//           </div>
//         </div>

//       </div>
//     </footer>
//   );
// }

// export default Footer;
import { FiArrowUpRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const externalLinks = [
  { name: "Dribbble", url: "https://dribbble.com/vijay-rovo" },
  { name: "Instagram", url: "https://instagram.com/vijay_saini_192" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/vijay-saini-51310a238/" },
  { name: "GitHub", url: "https://github.com/Vijay-192" },
];

const internalLinks = [
  { name: "Admin Panel", url: "/dashboard" },
  { name: "Projects", url: "/work" },
  { name: "About", url: "/about" },
];

function Footer() {
  return (
    <footer className="bg-black text-white px-6 md:px-16 py-16 md:py-24 font-JetBrainsMono">
      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-12 border-b border-gray-800">

          <div className="lg:col-span-7 space-y-8">
            <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl leading-tight max-w-2xl">
              Designing digital experiences that feel intuitive and delightful.
            </h2>

            <div className="max-w-md">
              <Link
                to="/book-discovery-call"
                className="group inline-flex items-center gap-2 text-sm text-gray-300 border border-gray-700 rounded-full px-6 py-3 hover:border-gray-400 hover:text-white transition-colors"
              >
                <span>Book a Discovery Call</span>
                <FiArrowUpRight className="text-xs opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-3 gap-8 sm:gap-10">

            <div>
              <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">
                Navigation
              </h3>
              <ul className="flex flex-col gap-3">
                {internalLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.url}
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
              <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">
                Connect
              </h3>
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

            <div>
              <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">
                Resume / CV
              </h3>
              <ul className="flex flex-col gap-3">
                <li>
                  <a
                    href="/resume.pdf"
                    download
                    className="group flex items-center gap-2 text-sm text-gray-300 transition-colors hover:text-white"
                  >
                    <span>Resume</span>
                    <FiArrowUpRight className="text-xs opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:-translate-y-0.5" />
                  </a>
                </li>
                <li>
                  <a
                    href="/cv.pdf"
                    download
                    className="group flex items-center gap-2 text-sm text-gray-300 transition-colors hover:text-white"
                  >
                    <span>CV</span>
                    <FiArrowUpRight className="text-xs opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:-translate-y-0.5" />
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* ✅ Fixed paths to match router */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Vijay Saini. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-use" className="hover:text-gray-300 transition-colors">
              Terms
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;