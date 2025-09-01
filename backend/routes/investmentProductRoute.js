// backend/routes/investmentProductRoute.js
import express from "express";
import {
    addInvestmentProduct,
    listInvestmentProducts,
    getInvestmentProduct,
    updateInvestmentProduct,
    removeInvestmentProduct,
    getFundingAnalytics,
} from "../controllers/investmentProductController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const investmentProductRouter = express.Router();

// Public routes
investmentProductRouter.get("/list", listInvestmentProducts);
investmentProductRouter.get("/:id", getInvestmentProduct);

// Admin routes
investmentProductRouter.post(
    "/add",
    adminAuth,
    upload.fields([
        { name: "coverImage", maxCount: 1 },
        { name: "albumArt", maxCount: 1 },
        { name: "posterImage", maxCount: 1 },
        { name: "galleryImages", maxCount: 10 },
        { name: "demoTrack", maxCount: 1 },
        { name: "fullTrack", maxCount: 1 },
    ]),
    addInvestmentProduct
);

investmentProductRouter.put("/:id", adminAuth, updateInvestmentProduct);
investmentProductRouter.delete("/:id", adminAuth, removeInvestmentProduct);
investmentProductRouter.get("/admin/analytics", adminAuth, getFundingAnalytics);

export default investmentProductRouter;