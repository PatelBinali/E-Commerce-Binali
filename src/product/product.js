const express = require('express');
const router = express.Router();
const productController = require('./productController');
const productValidation = require('../validation/productValidation');
const auth = require('../middleware/authMiddleware');
const queryValidation = require('../validation/queryValidation');

router.get('/getProduct',auth,productController.getProduct);

router.get('/allProduct',[auth,queryValidation],productController.allProduct);

router.post('/addProduct',[auth,productValidation],productController.addProduct);

router.put('/updateProduct',[auth,productValidation],productController.updateProduct);

router.delete('/deleteProduct',auth,productController.deleteProduct);

module.exports = router;
