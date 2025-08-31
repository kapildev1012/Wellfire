import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// ✅ Helper: Upload Single Image
const uploadImage = async(file) => {
    if (!file || !file.path) return null;
    const result = await cloudinary.uploader.upload(file.path, {
        resource_type: "image",
        folder: "products", // your Cloudinary folder
    });
    return result.secure_url;
};

// ✅ Add Product
const addProduct = async(req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            subCategory,
            sizes,
            bestseller,
            inStock,
        } = req.body;

        // ✅ Parse sizes
        let parsedSizes = [];
        try {
            parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;

            if (!Array.isArray(parsedSizes) || parsedSizes.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Sizes must be a non-empty array.",
                });
            }

            parsedSizes = parsedSizes.map((entry) => ({
                size: entry.size,
                price: Number(entry.price),
            }));
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: "Invalid sizes format. Expecting JSON or array.",
            });
        }

        const image1 = req.files ? req.files.image1 : null;
        const image2 = req.files ? req.files.image2 : null;
        const image3 = req.files ? req.files.image3 : null;
        const image4 = req.files ? req.files.image4 : null;

        if (!image1) {
            return res.status(400).json({
                success: false,
                message: "Image1 is required.",
            });
        } // ✅ Determine base price
        let basePrice = null;
        if (price && !isNaN(Number(price))) {
            basePrice = Number(price);
        } else {
            const numericPrices = parsedSizes
                .map((s) => Number(s.price))
                .filter((p) => !isNaN(p));
            basePrice = numericPrices.length > 0 ? Math.min(...numericPrices) : 0;
        }

        // ✅ Create and save product
        const newProduct = new productModel({
            name,
            description,
            price: basePrice,
            category,
            subCategory,
            bestseller: bestseller === "true" || bestseller === true,
            inStock: inStock === "true" || inStock === true,
            sizes: parsedSizes,
            image1,
            image2,
            image3,
            image4,
            date: new Date(),
        });

        await newProduct.save();

        res.status(201).json({
            success: true,
            message: "Product added successfully.",
            product: newProduct,
        });
    } catch (error) {
        console.error("❌ Add Product Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while adding product.",
        });
    }
};

// ✅ List Products
const listProducts = async(req, res) => {
    try {
        const products = await productModel.find({});
        res.status(200).json({ success: true, products });
    } catch (error) {
        console.error("❌ List Products Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Remove Product
const removeProduct = async(req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res
                .status(400)
                .json({ success: false, message: "Product ID is required." });
        }

        await productModel.findByIdAndDelete(id);
        res
            .status(200)
            .json({ success: true, message: "Product removed successfully." });
    } catch (error) {
        console.error("❌ Remove Product Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Single Product by ID
const singleProduct = async(req, res) => {
    try {
        const { productId } = req.params; // 🔥 use params, not body
        if (!productId) {
            return res
                .status(400)
                .json({ success: false, message: "Product ID is required." });
        }

        const product = await productModel.findById(productId);
        if (!product) {
            return res
                .status(404)
                .json({ success: false, message: "Product not found." });
        }

        res.status(200).json({ success: true, product });
    } catch (error) {
        console.error("❌ Single Product Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { addProduct, listProducts, removeProduct, singleProduct };