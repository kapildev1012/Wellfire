import express from 'express';
import { addProduct, listProducts, getProduct, updateProduct, removeProduct } from '../controllers/productController.js';
import { addInvestment, getProductInvestments, getAllInvestments } from '../controllers/investorController.js';
import adminAuth from '../middleware/adminAuth.js';
import upload from '../middleware/multer.js';

const productRouter = express.Router();

// Product routes (temporarily removing adminAuth for testing)
productRouter.post('/add', upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'albumArt', maxCount: 1 },
    { name: 'posterImage', maxCount: 1 },
    { name: 'galleryImage', maxCount: 1 },
    { name: 'demoTrack', maxCount: 1 },
    { name: 'fullTrack', maxCount: 1 }
]), addProduct);

productRouter.get('/list', listProducts);
productRouter.get('/:id', getProduct);
productRouter.put('/update/:id', adminAuth, updateProduct);
productRouter.delete('/remove/:id', adminAuth, removeProduct);

// Investment routes
productRouter.post('/invest', addInvestment);
productRouter.get('/investments/:productId', getProductInvestments);
productRouter.get('/investments', adminAuth, getAllInvestments);

export default productRouter;