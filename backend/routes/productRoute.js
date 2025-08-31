import express from "express";
import { addProduct, listProducts, removeProduct, singleProduct } from "../controllers/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// Add Product (with image upload)
router.post(
    "/add",
    adminAuth,
    upload.fields([
        { name: "image1", maxCount: 1 },
        { name: "image2", maxCount: 1 },
        { name: "image3", maxCount: 1 },
        { name: "image4", maxCount: 1 },
    ]),
    addProduct
);

// Get All Products
router.get("/list", listProducts);

// Get Single Product
router.get("/:productId", singleProduct);

// Remove Product
router.delete("/remove", adminAuth, removeProduct);

export default router;