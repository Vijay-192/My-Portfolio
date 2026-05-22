import React from "react";

const Achievements = ({ achievementsList }) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {achievementsList.map((ach, i) => (
        <div
          key={i}
          className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row gap-3 sm:gap-5 hover:border-gray-600 duration-300"
        >
          {/* LEFT IMAGE */}
          <div className="w-full md:w-[35%]">
            <img
              src={ach.image}
              className="w-full h-36 sm:h-40 md:h-40 rounded-lg object-cover shadow-lg"
              alt="Achievement"
            />
          </div>

          {/* RIGHT DETAILS */}
          <div className="flex-1 text-white space-y-1 sm:space-y-2">
            <h4 className="text-md sm:text-lg md:text-lg font-semibold text-blue-300">
              {ach.heading}
            </h4>

            <div className="grid grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm opacity-80 mt-1">
              <p>📅 Year: {ach.year}</p>
              <p>📌 Category: {ach.category}</p>
            </div>

            <p className="opacity-90 text-xs sm:text-sm mt-2">
              {ach.description}
            </p>

            <div className="flex flex-wrap gap-1 sm:gap-2 mt-2 sm:mt-3">
              {ach.hashtags.map((tag, t) => (
                <span
                  key={t}
                  className="text-xs sm:text-sm bg-gray-800 px-2 sm:px-3 py-1 rounded-full border border-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Achievements;