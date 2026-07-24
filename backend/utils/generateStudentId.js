const Counter = require("../models/Counter");

const generateStudentId = async () => {
  const year = new Date().getFullYear();

  const counter = await Counter.findOneAndUpdate(
    { name: "studentId" },
    {
      $inc: {
        sequence: 1,
      },
    },
    {
      new: true,
      upsert: true,
    }
  );

  return `GMT-STU-${year}-${String(counter.sequence).padStart(4, "0")}`;
};

module.exports = generateStudentId;