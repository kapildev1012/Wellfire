import multer from "multer";
import path from "path";

// ✅ Storage: Temporarily store in /uploads (Cloudinary will upload from here)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save to local /uploads folder temporarily
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
        cb(null, uniqueName);
    },
});

// ✅ Filter only image types
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error("Only image files are allowed (jpeg, jpg, png, webp, gif)."));
    }
};

// ✅ Max file size: 5MB
const limits = {
    fileSize: 5 * 1024 * 1024, // 5MB
};

const upload = multer({
    storage,
    fileFilter,
    limits,
});

export default upload;