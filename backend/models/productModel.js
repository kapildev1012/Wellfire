import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },

    image1: { type: String, required: true, match: /^https?:\/\// },
    image2: { type: String, match: /^https?:\/\// },
    image3: { type: String, match: /^https?:\/\// },
    image4: { type: String, match: /^https?:\/\// },

    category: { type: String, required: true },
    subCategory: { type: String, required: true },

    sizes: [{
        size: { type: String, required: true },
        price: { type: Number, required: true },
    }, ],

    bestseller: { type: Boolean, default: false },
    inStock: { type: Boolean, default: true },
    date: { type: Date, default: Date.now },
});

const productModel =
    mongoose.models.Product || mongoose.model("Product", productSchema);

export default productModel;