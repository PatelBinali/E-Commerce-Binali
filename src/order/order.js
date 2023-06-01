const express = require('express');
const router = express.Router();
const orderController = require('./orderController');
const auth = require('../middleware/authMiddleware');

router.get('/getOrderDetailsById',auth,orderController.getOrderDetailsById);

router.post('/placeOrder',auth,orderController.placeOrder);

router.delete('/cancleOrder',auth,orderController.cancleOrder);

router.delete('/cancleOrderDetails',auth,orderController.cancleOrderDetails);

module.exports = router;
