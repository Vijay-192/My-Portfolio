import { fetchEducation } from "../../redux-store/EducationSlice";
import { fetchAchievements } from "../../redux-store/AchievementSlice";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowUpRight } from "lucide-react";

const Education = () => {
  const dispatch = useDispatch();
  const { education, loading: eduLoading } = useSelector(
    (state) => state.education,
  );
  const { achievements, loading: achLoading } = useSelector(
    (state) => state.achievements,
  );
  const [openIndex, setOpenIndex] = useState(null);
  const [currentImg, setCurrentImg] = useState(0);
  useEffect(() => {
    dispatch(fetchEducation());
    dispatch(fetchAchievements());
  }, [dispatch]);
  const sliderImages = education.flatMap((e) => e.images || []).filter(Boolean);

  useEffect(() => {
    if (sliderImages.length < 2) return;
    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % sliderImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [sliderImages.length]);

  const sections = [
    {
      title: "Bachelor of Technology — computer science and engineering",
      type: "education",
    },
    { title: "Achievements & Certifications", type: "achievements" },
  ];

  return (
    <div className="bg-black min-h-auto p-4 sm:p-6 md:p-10 flex justify-center items-start font-JetBrainsMono">
      <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[73%] space-y-6">
        <h1
          className="
            text-white/50 tracking-tight
            text-4xl sm:text-5xl md:text-6xl
            px-20 sm:px-8 md:px-26 lg:px-44 xl:px-57
            -translate-x-[18%] sm:-translate-x-[22%]
            relative
          "
        >
          education
        </h1>
        {sections.map((section, index) => (
          <div key={index} className="mb-2">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="group relative flex items-center justify-between w-full text-lg sm:text-xl md:text-2xl font-semibold px-4 py-3"
            >
              <span className="text-white">{section.title}</span>
              <ArrowUpRight
                size={22}
                className={`text-white duration-500 ${
                  openIndex === index ? "rotate-45" : ""
                }`}
              />
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white" />
            </button>

            <div
              className={`overflow-hidden transition-all duration-500 mt-4 ${
                openIndex === index ? "max-h-[100vh]" : "max-h-0"
              }`}
            >
              {section.type === "education" && (
                <>
                  {eduLoading && (
                    <p className="text-white/40 text-sm px-4">Loading...</p>
                  )}

                  {!eduLoading &&
                    education.map((item) => (
                      <div
                        key={item._id}
                        className="p-4 sm:p-6 md:p-6 bg-gray-900 rounded-lg flex flex-col md:flex-row gap-4 md:gap-8 mb-4"
                      >
                        <div className="w-full md:w-[35%]">
                          {sliderImages.length > 0 && (
                            <img
                              src={
                                sliderImages[currentImg % sliderImages.length]
                              }
                              alt="Institute"
                              className="w-full h-48 sm:h-52 md:h-52 rounded-xl object-cover shadow-lg"
                            />
                          )}
                        </div>
                        <div className="flex-1 text-white space-y-1 sm:space-y-2">
                          {/* Course name as heading */}
                          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold">
                            {item.courseName}
                            {item.branch && ` — ${item.branch}`}
                          </h3>
                          {item.educationType === "college" && (
                            <>
                              <p className="opacity-80 text-sm sm:text-base">
                                🏫 {item.instituteName}
                              </p>
                              {item.universityName && (
                                <p className="opacity-80 text-sm sm:text-base">
                                  🎓 {item.universityName}
                                </p>
                              )}
                            </>
                          )}

                          {/* School fields */}
                          {item.educationType === "school" && (
                            <>
                              <p className="opacity-80 text-sm sm:text-base">
                                🏫 {item.instituteName}
                              </p>
                              {item.board && (
                                <p className="opacity-80 text-sm sm:text-base">
                                  📋 Board: {item.board}
                                </p>
                              )}
                              {item.stream && (
                                <p className="opacity-80 text-sm sm:text-base">
                                  📚 Stream: {item.stream}
                                </p>
                              )}
                            </>
                          )}

                          {/* Common fields */}
                          <p className="opacity-80 text-sm sm:text-base">
                            📅 {item.session}
                          </p>

                          {item.cgpa && (
                            <p className="opacity-80 text-sm sm:text-base">
                              🎯 CGPA: {item.cgpa}
                            </p>
                          )}

                          {item.percentage && (
                            <p className="opacity-80 text-sm sm:text-base">
                              🎯 Percentage: {item.percentage}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </>
              )}
              {section.type === "achievements" && (
                <div className="space-y-4 sm:space-y-6">
                  {achLoading && (
                    <p className="text-white/40 text-sm px-4">Loading...</p>
                  )}

                  {!achLoading &&
                    achievements.map((ach) => (
                      <div
                        key={ach._id}
                        className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row gap-3 sm:gap-5 hover:border-gray-600 duration-300"
                      >
                        <div className="w-full md:w-[35%]">
                          {ach.images?.[0] && (
                            <img
                              src={ach.images[0]}
                              className="w-full h-36 sm:h-40 md:h-40 rounded-lg object-cover shadow-lg"
                              alt={ach.title}
                            />
                          )}
                        </div>
                        <div className="flex-1 text-white space-y-1 sm:space-y-2">
                          <h4 className="text-md sm:text-lg md:text-lg font-semibold text-blue-300">
                            {ach.title}
                          </h4>

                          <div className="grid grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm opacity-80 mt-1">
                            <p>📅 Year: {ach.year}</p>
                            <p>📌 Category: {ach.category}</p>
                          </div>

                          {ach.description && (
                            <p className="opacity-90 text-xs sm:text-sm mt-2">
                              {ach.description}
                            </p>
                          )}
                          {ach.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1 sm:gap-2 mt-2 sm:mt-3">
                              {ach.tags.map((tag, t) => (
                                <span
                                  key={t}
                                  className="text-xs sm:text-sm bg-gray-800 px-2 sm:px-3 py-1 rounded-full border border-gray-700"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education;
