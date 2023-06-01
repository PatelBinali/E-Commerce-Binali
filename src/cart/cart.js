const express = require('express');
const router = express.Router();
const cartController = require('./cartController');
const auth = require('../middleware/authMiddleware');
const cartValidation = require('../validation/cartValidation');

router.get('/getCartById',auth,cartController.getCartById);

router.post('/addToCart',[auth,cartValidation],cartController.addToCart);

router.put('/updateCart',auth,cartController.updateCart);

router.delete('/deleteCart',auth,cartController.deleteCart);

router.delete('/deleteCartDetails',auth,cartController.deleteCartDetails);

module.exports = router;