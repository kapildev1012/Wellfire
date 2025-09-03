import Product from "../models/productModel.js";
import Investor from "../models/investorModel.js";
import { v2 as cloudinary } from "cloudinary";

// Add new product
const addProduct = async(req, res) => {
    try {
        console.log("Request body:", req.body);
        console.log("Request files:", req.files);

        let {
            productTitle,
            description,
            artistName,
            producerName,
            labelName,
            category,
            genre,
            totalBudget,
            minimumInvestment,
            expectedDuration,
            productStatus,
            targetAudience,
            isFeatured,
            isActive,
        } = req.body;

        // ✅ Provide defaults if missing (to avoid validation error)
        if (!productTitle) productTitle = "Untitled Project";
        if (!description) description = "No description provided";
        if (!artistName) artistName = "Unknown Artist";

        // ✅ Parse targetAudience if needed
        let parsedAudience = [];
        try {
            parsedAudience =
                typeof targetAudience === "string" ?
                JSON.parse(targetAudience) :
                targetAudience || [];
        } catch (error) {
            parsedAudience = [];
        }

        // ✅ Handle file uploads (Multer OR express-fileupload)
        const uploadResults = {};
        const imageFields = ["coverImage", "albumArt", "posterImage", "galleryImage"];
        for (const field of imageFields) {
            if (req.files && req.files[field]) {
                const filePath = Array.isArray(req.files[field]) ?
                    req.files[field][0].path :
                    req.files[field].tempFilePath || req.files[field].path;

                const result = await cloudinary.uploader.upload(filePath, {
                    resource_type: "image",
                    folder: "music-products/images",
                });
                uploadResults[field] = result.secure_url;
            }

        }

        const audioFields = ["demoTrack", "fullTrack"];
        for (const field of audioFields) {
            if (req.files && req.files[field]) {
                const filePath =
                    req.files[field][0] ? .path || req.files[field].tempFilePath;
                const result = await cloudinary.uploader.upload(filePath, {
                    resource_type: "video", // Cloudinary uses video pipeline for audio
                    folder: "music-products/audio",
                });
                uploadResults[field] = result.secure_url;
            }
        }

        // ✅ Construct product data
        const productData = {
            productTitle,
            description,
            artistName,
            producerName,
            labelName,
            category,
            genre,
            totalBudget: Number(totalBudget) || 0,
            minimumInvestment: Number(minimumInvestment) || 0,
            expectedDuration,
            productStatus: productStatus || "funding",
            targetAudience: parsedAudience,
            isFeatured: isFeatured === "true" || isFeatured === true,
            isActive: isActive === "true" || isActive === true,
            ...uploadResults,
        };

        console.log("Product data to save:", productData);

        const product = new Product(productData);
        await product.save();

        return res.status(201).json({
            success: true,
            message: "Product added successfully",
            product,
        });
    } catch (error) {
        console.error("Add product error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

// List products
const listProducts = async(req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 });

        const productsWithFunding = products.map((product) => {
            const fundingPercentage =
                product.totalBudget > 0 ?
                Math.min((product.currentFunding / product.totalBudget) * 100, 100) :
                0;

            return {
                ...product.toObject(),
                fundingPercentage: fundingPercentage.toFixed(1),
            };
        });

        res.json({ success: true, products: productsWithFunding });
    } catch (error) {
        console.error("List products error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single product
const getProduct = async(req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const investors = await Investor.find({
            productId: id,
            paymentStatus: "completed",
        });

        const fundingPercentage =
            product.totalBudget > 0 ?
            Math.min((product.currentFunding / product.totalBudget) * 100, 100) :
            0;

        res.json({
            success: true,
            product: {
                ...product.toObject(),
                fundingPercentage: fundingPercentage.toFixed(1),
                investors: investors.length,
            },
        });
    } catch (error) {
        console.error("Get product error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update product
const updateProduct = async(req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (updates.targetAudience && typeof updates.targetAudience === "string") {
            try {
                updates.targetAudience = JSON.parse(updates.targetAudience);
            } catch (error) {
                updates.targetAudience = [];
            }
        }

        updates.updatedAt = Date.now();

        const product = await Product.findByIdAndUpdate(id, updates, { new: true });

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.json({ success: true, message: "Product updated successfully", product });
    } catch (error) {
        console.error("Update product error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete product
const removeProduct = async(req, res) => {
    try {
        const { id } = req.params;

        await Investor.deleteMany({ productId: id });
        await Product.findByIdAndDelete(id);

        res.json({ success: true, message: "Product removed successfully" });
    } catch (error) {
        console.error("Remove product error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { addProduct, listProducts, getProduct, updateProduct, removeProduct };