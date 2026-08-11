const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const connectDB = require("./config/db");

// ============================================================
// ROUTES
// ============================================================

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const activityRoutes = require("./routes/activityRoutes");
const instructorRoutes = require("./routes/instructorRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const notificationRoutes = require("./routes/notificationRoutes");


// ============================================================
// APP
// ============================================================

const app = express();


// ============================================================
// MIDDLEWARE
// ============================================================

app.use(
  cors()
);

app.use(
  express.json()
);


// ============================================================
// UPLOADS
// ============================================================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);


// ============================================================
// API ROUTES
// ============================================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/students",
  studentRoutes
);

app.use(
  "/api/courses",
  courseRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/enrollments",
  enrollmentRoutes
);

app.use(
  "/api/assignments",
  assignmentRoutes
);

app.use(
  "/api/submissions",
  submissionRoutes
);

app.use(
  "/api/announcements",
  announcementRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/certificates",
  certificateRoutes
);

app.use(
  "/api/activity",
  activityRoutes
);

app.use(
  "/api/instructor",
  instructorRoutes
);

app.use(
  "/api/settings",
  settingsRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);


// ============================================================
// ROOT ROUTE
// ============================================================

app.get("/", (req, res) => {
  res.status(200).send(
    "LMS API Running..."
  );
});


// ============================================================
// START SERVER
// ============================================================

const PORT =
  process.env.PORT || 5000;


// ============================================================
// CONNECT DATABASE THEN START SERVER
// ============================================================

const startServer = async () => {
  try {

    await connectDB();

    app.listen(
      PORT,
      () => {
        console.log(
          `Server running on port ${PORT}`
        );
      }
    );

  } catch (error) {

    console.error(
      "Failed to start server:",
      error.message
    );

    process.exit(1);
  }
};


startServer();