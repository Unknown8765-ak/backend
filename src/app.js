import cors from "cors"
import cookieParser from "cookie-parser"
import express from "express"
const app = express()

app.use(cookieParser())

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
)
console.log(process.env.CORS_ORIGIN)

// const allowedOrigins = process.env.CORS_ORIGIN
//   .split(",")
//   .map((origin) => origin.trim());

// console.log("",allowedOrigins)

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Backend is running successfully"
    });
});
console.log("App.js Loaded");
app.use(express.json())
app.use(express.urlencoded({extended : true , limit : "16kb"}))
app.use(express.static("public"))
import errorHandler from "./middlewares/error.middleware.js"
import authRoute from "./routes/auth.routes.js";
import galleryRoute from "./routes/gallery.routes.js";
import leadRoute from "./routes/lead.routes.js";
import testimonialRoute from "./routes/testimonial.routes.js";
import profileRoute from "./routes/profile.routes.js"
import settingsRoute from "./routes/setting.routes.js"
import dashboardRoutes from "./routes/dashboard.route.js";
import websiteContentRoute from "./routes/websiteContent.route.js"
import contactRoutes from "./routes/contact.route.js";
import blogRoute from "./routes/blog.route.js"



app.use("/api/v1/auth", authRoute);
app.use("/api/v1/gallery", galleryRoute);
app.use("/api/v1/leads", leadRoute);
app.use("/api/v1/testimonials", testimonialRoute);
app.use("/api/v1/profile", profileRoute);
app.use("/api/v1/settings", settingsRoute);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/website-content",websiteContentRoute );
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/blogs", blogRoute);


app.use(errorHandler)

export { app }
