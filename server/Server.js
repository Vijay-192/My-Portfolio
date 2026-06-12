import "dotenv/config";
import express from "express";
import cors from "cors";
import ConnectDatabase from "./DB/db.js";
import projectRoutes from "./Routes/Project.route.js"
import blogRoutes from "./Routes/Blog.route.js"
import educationRoutes from "./Routes/Education.route.js"
import serviceRoutes from "./Routes/Service.route.js"
import skillRoutes from "./Routes/Skill.route.js"
import authRoutes from "./Routes/Auth.route.js"
import achievementRoutes from "./Routes/Achievement.route.js"
import bookingRoutes from "./Routes/Booking.route.js"
import resumeRoutes from "./Routes/Resume.route.js";
import { cvRouter } from "./Routes/Resume.route.js";
import galleryRoutes from "./Routes/Gallery.route.js";
const app = express();
const PORT = process.env.PORT || 5000;
//  Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use("/api/projects", projectRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/cv", cvRouter); 
app.use("/api/gallery", galleryRoutes);
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  ConnectDatabase();
  console.log(`server listening at port: ${PORT}`);
});
