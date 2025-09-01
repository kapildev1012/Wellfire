// backend/server.js (Updated)
import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

// Routes
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
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
app.use(express.json());
app.use(cors());

// Create uploads directory if it doesn't exist
import fs from 'fs';
import path from 'path';
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// API Endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// ✅ New Investment APIs
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
                message: "File too large. Check file size limits.",
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: "Too many files uploaded.",
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