import userModel from "../models/userModel.js";

// ✅ Add products to user cart
const addToCart = async(req, res) => {
    try {
        const { userId, itemId, size, quantity = 1 } = req.body;

        const userData = await userModel.findById(userId);
        let cartData = userData.cartData || {};

        // Initialize item if not present
        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }

        // Add quantity to the selected size
        if (cartData[itemId][size]) {
            cartData[itemId][size] += quantity;
        } else {
            cartData[itemId][size] = quantity;
        }

        await userModel.findByIdAndUpdate(userId, { cartData });

        res.json({ success: true, message: "Added to cart successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ✅ Update quantity in cart
const updateCart = async(req, res) => {
    try {
        const { userId, itemId, size, quantity } = req.body;

        const userData = await userModel.findById(userId);
        let cartData = userData.cartData || {};

        // Handle edge cases
        if (!cartData[itemId]) cartData[itemId] = {};

        if (quantity > 0) {
            cartData[itemId][size] = quantity;
        } else {
            delete cartData[itemId][size];
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId];
            }
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Cart Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ✅ Get user cart data
const getUserCart = async(req, res) => {
    try {
        const { userId } = req.body;

        const userData = await userModel.findById(userId);
        let cartData = userData.cartData || {};

        res.json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { addToCart, updateCart, getUserCart };