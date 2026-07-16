const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ==========================================
// CREATE uploads/assignments FOLDER IF MISSING
// ==========================================
const uploadPath = path.join(
  __dirname,
  "../uploads/assignments"
);

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// ==========================================
// STORAGE CONFIGURATION
// ==========================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

// ==========================================
// ALLOWED FILE TYPES
// ==========================================
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    ".pdf",
    ".doc",
    ".docx",
    ".ppt",
    ".pptx",
    ".xls",
    ".xlsx",
    ".zip",
    ".rar",
    ".jpg",
    ".jpeg",
    ".png",
    ".txt",
  ];

  const extension = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(extension)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only PDF, DOC, DOCX, PPT, XLS, ZIP, Images and TXT files are allowed."
      ),
      false
    );
  }
};

// ==========================================
// MULTER CONFIGURATION
// ==========================================
const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
});

module.exports = upload;