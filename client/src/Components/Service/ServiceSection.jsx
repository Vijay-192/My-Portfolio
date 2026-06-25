import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchServices,
  selectServices,
  selectServiceLoading,
} from "../../redux-store/ServiceSlice";
const ServiceSkeleton = () => (
  <section
    id="services"
    className="w-full overflow-x-hidden bg-black font-JetBrainsMono"
  >
    <div className="min-h-screen text-white overflow-x-hidden">
      {/* Hero skeleton */}
      <div className="relative flex flex-col items-center justify-center text-center h-[65vh] sm:h-[60vh] px-4 gap-5">
        <div className="sk h-[10vw] min-h-[56px] w-[55%] rounded-2xl" />
        <div className="sk h-3 w-[42%] rounded-lg" />
        <div className="sk h-3 w-[35%] rounded-lg" style={{ animationDelay: "0.06s" }} />
      </div>

      {/* Rows skeleton */}
      <div className="w-[90%] md:w-[70%] mx-auto flex flex-col divide-y divide-white/10 pb-20">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 items-center px-2 sm:px-0 py-6"
            style={{ opacity: 1 - i * 0.18 }}
          >
            {/* ID */}
            <div className="sm:col-span-1">
              <div
                className="sk h-4 w-8 rounded"
                style={{ animationDelay: `${i * 0.08}s` }}
              />
            </div>

            {/* Title */}
            <div className="sm:col-span-3">
              <div
                className="sk h-5 w-[80%] rounded-lg"
                style={{ animationDelay: `${i * 0.08 + 0.04}s` }}
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-5 flex flex-col gap-2">
              <div
                className="sk h-3 w-full rounded"
                style={{ animationDelay: `${i * 0.08 + 0.06}s` }}
              />
              <div
                className="sk h-3 w-[85%] rounded"
                style={{ animationDelay: `${i * 0.08 + 0.10}s` }}
              />
              <div
                className="sk h-3 w-[70%] rounded"
                style={{ animationDelay: `${i * 0.08 + 0.14}s` }}
              />
            </div>

            {/* Image */}
            <div className="sm:col-span-3 flex justify-start sm:justify-center">
              <div
                className="sk  w-[250px] h-[180px] md:w-[300px] md:h-[200px]"
                style={{ animationDelay: `${i * 0.08 + 0.08}s` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
function ServiceSection() {
  const dispatch = useDispatch();
  const services = useSelector(selectServices);
  const loading = useSelector(selectServiceLoading);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);


  if (loading) return <ServiceSkeleton />;

  return (
    <section
      id="services"
      className="w-full overflow-x-hidden bg-black font-JetBrainsMono"
    >
      <div className="min-h-screen text-white overflow-x-hidden">
        {/* Hero */}
        <div className="relative flex flex-col items-center justify-center text-center h-[65vh] sm:h-[60vh] px-4 overflow-hidden">
      <h1 className="font-JetBrainsMono font-extrabold tracking-tight text-[20vw] sm:text-[16vw] md:text-[14vw] lg:text-[12vw] leading-none">
  services
</h1>
          <p className="mt-6 max-w-3xl text-white/70">
            We're not just storytellers — we craft digital experiences that push
            brands forward through strategy, design, and innovation.
          </p>
        </div>

        {/* Rows */}
        <div className="w-[90%] md:w-[70%] mx-auto min-h-screen text-white overflow-x-hidden">
          <div className="flex flex-col divide-y divide-white/15">
            {Array.isArray(services) && services.length > 0 ? (
              services.map((item, i) => (
                <div
                  key={item._id || i}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 items-center px-2 sm:px-0 py-6"
                >
                  {/* ID */}
                  <div className="sm:col-span-1 text-sm sm:text-base md:text-lg">
                    ({String(i + 1).padStart(2, "0")})
                  </div>

                  {/* Title */}
                  <div className="sm:col-span-3 text-base sm:text-lg md:text-2xl">
                    {item.title}
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-5 text-sm md:text-[15px] leading-relaxed">
                    {item.description}
                  </div>

                  {/* Image */}
                  <div className="sm:col-span-3 flex justify-start sm:justify-center">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className=" object-cover w-[470px] h-[180px] sm:w-[250px] sm:h-[180px] md:w-[300px] md:h-[200px]"
                      />
                    ) : (
                      <div className=" bg-white/5 flex items-center justify-center w-[470px] h-[180px] sm:w-[250px] sm:h-[180px] md:w-[300px] md:h-[200px]">
                        <span className="text-white/30 text-sm">No image</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center text-white/50">
                
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServiceSection;