// backend/server.js (Fixed)
import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/Cloudinary.js";
import upload from "./middleware/multer.js"; // ✅ Added missing import

// Routes
import userRouter from "./routes/userRoute.js";

import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import investmentProductRouter from "./routes/investmentProductRoute.js";
import investorRouter from "./routes/investorRoute.js";

// App Config
const app = express();
const port = process.env.PORT || 4000;

// Connect to database and cloud services
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json({ limit: '50mb' })); // ✅ Increased limit
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // ✅ Added urlencoded
app.use(cors());

// Create uploads directory if it doesn't exist
import fs from 'fs';
import path from 'path';
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("✅ Uploads directory created");
}

// API Endpoints
app.use("/api/user", userRouter);

app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// ✅ Investment APIs
app.use("/api/investment-product", investmentProductRouter);
app.use("/api/investor", investorRouter);

app.get("/", (req, res) => {
    res.send("✅ API Working - Investment Platform Ready");
});

// Enhanced error handling
app.use((error, req, res, next) => {
    console.error("Global error handler:", error);

    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: "File too large. Maximum size is 100MB per file.",
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: "Too many files uploaded. Maximum 15 files allowed.",
            });
        }
    }

    res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
    });
});

// 404 handler
app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

app.listen(port, () =>
    console.log(`🚀 Investment Platform Server started on http://localhost:${port}`)
);