// backend/controllers/investmentProductController.js
import InvestmentProduct from "../models/investmentProductModel.js";
import Investor from "../models/investorModel.js";
import { v2 as cloudinary } from "cloudinary";

// Add new investment product
const addInvestmentProduct = async(req, res) => {
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
        const imageFields = ["coverImage", "albumArt", "posterImage"];

        for (const field of imageFields) {
            if (req.files && req.files[field]) {
                const filePath = Array.isArray(req.files[field]) ?
                    req.files[field][0].path :
                    req.files[field].tempFilePath || req.files[field].path;

                const result = await cloudinary.uploader.upload(filePath, {
                    resource_type: "image",
                    folder: "investment-products/images",
                });
                uploadResults[field] = result.secure_url;
            }
        }

        // Handle gallery images
        if (req.files && req.files["galleryImages"]) {
            const galleryFiles = Array.isArray(req.files["galleryImages"]) ?
                req.files["galleryImages"] : [req.files["galleryImages"]];

            const galleryUrls = [];
            for (const file of galleryFiles) {
                const filePath = file.path || file.tempFilePath;
                const result = await cloudinary.uploader.upload(filePath, {
                    resource_type: "image",
                    folder: "investment-products/gallery",
                });
                galleryUrls.push(result.secure_url);
            }
            uploadResults.galleryImages = galleryUrls;
        }

        const audioFields = ["demoTrack", "fullTrack"];
        for (const field of audioFields) {
            if (req.files && req.files[field]) {
                const filePath = req.files[field][0] ? .path || req.files[field].tempFilePath;
                const result = await cloudinary.uploader.upload(filePath, {
                    resource_type: "video", // Cloudinary uses video pipeline for audio
                    folder: "investment-products/audio",
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

        const product = new InvestmentProduct(productData);
        await product.save();

        return res.status(201).json({
            success: true,
            message: "Investment product added successfully",
            product,
        });
    } catch (error) {
        console.error("Add investment product error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

// List investment products with funding information
const listInvestmentProducts = async(req, res) => {
    try {
        const {
            category,
            status,
            featured,
            active = "true",
            page = 1,
            limit = 10,
            sortBy = "createdAt",
            sortOrder = "desc"
        } = req.query;

        // Build filter object
        const filter = {};
        if (category) filter.category = category;
        if (status) filter.productStatus = status;
        if (featured !== undefined) filter.isFeatured = featured === "true";
        if (active !== undefined) filter.isActive = active === "true";

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === "desc" ? -1 : 1;

        const skip = (page - 1) * limit;

        const products = await InvestmentProduct.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        // Calculate funding details for each product
        const productsWithFunding = await Promise.all(
            products.map(async(product) => {
                const investors = await Investor.find({
                    productId: product._id,
                    paymentStatus: "completed",
                });

                const totalInvestors = investors.length;
                const fundingPercentage = product.fundingPercentage;

                return {
                    ...product.toObject(),
                    fundingPercentage: fundingPercentage.toFixed(1),
                    totalInvestors,
                    remainingAmount: product.remainingAmount,
                };
            })
        );

        const total = await InvestmentProduct.countDocuments(filter);

        res.json({
            success: true,
            products: productsWithFunding,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / limit),
                totalProducts: total,
                hasNext: page * limit < total,
                hasPrev: page > 1,
            },
        });
    } catch (error) {
        console.error("List investment products error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single investment product with detailed funding info
const getInvestmentProduct = async(req, res) => {
    try {
        const { id } = req.params;
        const product = await InvestmentProduct.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Investment product not found"
            });
        }

        const investors = await Investor.find({
            productId: id,
            paymentStatus: "completed",
        }).select("investorName investmentAmount investmentDate email");

        const recentInvestments = await Investor.find({
                productId: id,
                paymentStatus: "completed",
            })
            .sort({ investmentDate: -1 })
            .limit(5)
            .select("investorName investmentAmount investmentDate");

        const fundingStats = {
            totalInvestors: investors.length,
            fundingPercentage: product.fundingPercentage.toFixed(1),
            remainingAmount: product.remainingAmount,
            averageInvestment: investors.length > 0 ?
                (product.currentFunding / investors.length).toFixed(2) : 0,
        };

        res.json({
            success: true,
            product: {
                ...product.toObject(),
                ...fundingStats,
                recentInvestments,
            },
        });
    } catch (error) {
        console.error("Get investment product error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update investment product
const updateInvestmentProduct = async(req, res) => {
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

        const product = await InvestmentProduct.findByIdAndUpdate(id, updates, {
            new: true
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Investment product not found"
            });
        }

        res.json({
            success: true,
            message: "Investment product updated successfully",
            product
        });
    } catch (error) {
        console.error("Update investment product error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete investment product and associated investors
const removeInvestmentProduct = async(req, res) => {
    try {
        const { id } = req.params;

        // Check if there are active investments
        const activeInvestors = await Investor.find({
            productId: id,
            paymentStatus: "completed",
        });

        if (activeInvestors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete product with active investments. Please refund investors first.",
            });
        }

        await Investor.deleteMany({ productId: id });
        await InvestmentProduct.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "Investment product removed successfully"
        });
    } catch (error) {
        console.error("Remove investment product error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get funding analytics
const getFundingAnalytics = async(req, res) => {
    try {
        const totalProducts = await InvestmentProduct.countDocuments();
        const activeProducts = await InvestmentProduct.countDocuments({
            isActive: true
        });
        const fundingProducts = await InvestmentProduct.countDocuments({
            productStatus: "funding"
        });

        const totalInvestments = await Investor.aggregate([
            { $match: { paymentStatus: "completed" } },
            { $group: { _id: null, total: { $sum: "$investmentAmount" } } }
        ]);

        const totalInvestors = await Investor.countDocuments({
            paymentStatus: "completed"
        });

        const categoryStats = await InvestmentProduct.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        const fundingProgress = await InvestmentProduct.aggregate([{
                $project: {
                    productTitle: 1,
                    totalBudget: 1,
                    currentFunding: 1,
                    fundingPercentage: {
                        $multiply: [
                            { $divide: ["$currentFunding", "$totalBudget"] },
                            100
                        ]
                    }
                }
            },
            { $sort: { fundingPercentage: -1 } },
            { $limit: 10 }
        ]);

        res.json({
            success: true,
            analytics: {
                overview: {
                    totalProducts,
                    activeProducts,
                    fundingProducts,
                    totalInvestment: totalInvestments[0] ? .total || 0,
                    totalInvestors,
                },
                categoryStats,
                topFundedProjects: fundingProgress,
            },
        });
    } catch (error) {
        console.error("Get funding analytics error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export {
    addInvestmentProduct,
    listInvestmentProducts,
    getInvestmentProduct,
    updateInvestmentProduct,
    removeInvestmentProduct,
    getFundingAnalytics,
};