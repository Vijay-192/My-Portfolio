import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../themeSlice";
import uiReducer from "../ColorUiSlice";
import authReducer from "../authSlice";
import projectReducer from "../Projectslice";
import blogReducer from "../BlogSlice";
import skillReducer from "../SkillSlice";
import serviceReducer from "../ServiceSlice";
import educationReducer from "../EducationSlice";
import achievementReducer from "../AchievementSlice";
import bookingReducer from "../Bookingslice";
import dashboardReducer from "../Dashboardslice";
export const store = configureStore({
  reducer: {
    theme: themeReducer,
    ui: uiReducer,
    auth: authReducer,
    projects: projectReducer,
    blogs: blogReducer,
    skills: skillReducer,
    services: serviceReducer,
    education: educationReducer,
    achievements: achievementReducer,
    booking: bookingReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
