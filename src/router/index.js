const express = require('express');
const router = express();
const user = require('../user/user');
const product = require('../product/product');
const cart = require('../cart/cart');
const order = require('../order/order');
// router
router.use('/user',user);
router.use('/product',product);
router.use('/cart',cart);
router.use('/order',order);

module.exports = router;
