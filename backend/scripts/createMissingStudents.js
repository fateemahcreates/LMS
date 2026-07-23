const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../models/User");
const Student = require("../models/Student");

async function createMissingStudents() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ Connected to MongoDB");

    const users = await User.find({ role: "student" });

    let counter = 1;

    for (const user of users) {
      const existing = await Student.findOne({
        user: user._id,
      });

      if (existing) continue;

      // Generate ID if missing
      let studentId = user.studentId;

if (!studentId) {
  const year = new Date().getFullYear();

  studentId = `GMT-STU-${year}-${String(counter).padStart(4, "0")}`;

  counter++;
}

      await Student.create({
        user: user._id,
        studentId,
        department: "Not Assigned",
        faculty: "",
        level: "100",
        semester: "First Semester",
        phone: "",
        address: "",
      });

      console.log(`✅ Created profile for ${user.email}`);
    }

    console.log("🎉 Migration Complete");

    process.exit();

  } catch (error) {
    console.error(error);

    process.exit(1);
  }
}

createMissingStudents();