const { ORDER, LOGGER, PRODUCT, CART, USER } = require('../helper/constant');
const orderService = require('./orderService');
const logger = require('../helper/logger');
const userService = require('../user/userService');
const productService = require('../product/productService');
const cartService = require('../cart/cartService');
const status = require('../helper/statusCode');
const redisCache = require('../redis/redisCache');

exports.getOrderDetailsById = async (req, res) => {
	try {
		const { orderId } = req.query;
		const orderCache = JSON.parse(await redisCache.getCache(orderId));
		if (orderCache === null) {
			const getOrderDetails = await orderService.getOrderDetailsById({ where:{ orderId },attributes: { exclude: ['createdAt','updatedAt','deletedAt'] } });
			const order = await orderService.order({ where:{ orderId:orderId } });
			await redisCache.setCache(getOrderDetails.orderId,getOrderDetails);
			return status.success(res,200,{ getOrderDetails,totalPrice:order.totalPrice });
		}
		else {
			return res.json(orderCache);
		}
	}
	catch (error) {
		logger.error({ 'error':error.message, 'orderController getOrderDetailsById':LOGGER.INTERNAL_SERVER_ERROR });
		return status.errors(res,500,error);
	}
};

exports.placeOrder = async (req, res) => {
	try {
		const placeOrder = req.body;
		const buyer = await userService.getUser({ where: { userId: placeOrder.buyerId } });
		if (buyer) {
			const cart = await cartService.getCart({ where:{ buyerId:placeOrder.buyerId } });
			if (cart) {
				placeOrder.totalPrice = cart.totalPrice;
				const orderData = await orderService.placeOrder(placeOrder);
				await redisCache.setCache(orderData.orderId,orderData);
				if (orderData) {
					const cartDetails = await cartService.getCartDetails({ where:{ cartId:cart.cartId } });
					const orderId = orderData.orderId;
					let orderDetails = [];
					for (let i = 0; i < cartDetails.length; i++) {
						const product = await productService.getProduct({ where:{ productId:cartDetails[i].productId } });
						if (product) {
							let order = {
								orderId,
								productId: cartDetails[i].productId,
								price: cartDetails[i].price,
								quantity: cartDetails[i].quantity,
								totalPrice: cartDetails[i].totalPrice
							};
							orderDetails.push(order);
						}
						else {
							logger.info({ 'orderController placeOrder':LOGGER.PRODUCT_NOT_FOUND });
							return status.errors(res,404,{ Message:PRODUCT.PRODUCT_NOT_FOUND });
						}
					}
					const details = await orderService.orderDetails(orderDetails);
					let arr = [];
					for (let i = 0;i < details.length;i++) {
						let array = {
							Id:details[i].Id,
							orderId:details[i].orderId,
							productId:details[i].productId,
							price:details[i].price,
							quantity:details[i].quantity,
							totalPrice:details[i].totalPrice
						};
						arr.push(array);
					}
					await redisCache.setCache(arr,arr);
					if (orderDetails) {
						let quantity = [];
						for (let i = 0;i < orderDetails.length;i++) {
							let product = {
								productId:orderDetails[i].productId,
								quantity:orderDetails[i].quantity
							};
							quantity.push(product);
							const getProduct = await productService.getProduct({ where:{ productId:quantity[i].productId } });
							getProduct.stock -= quantity[i].quantity;
							await productService.updateProduct({ stock:getProduct.stock },{ where:{ productId:getProduct.productId } });
							await cartService.deleteCartDetails({ where:{ productId:quantity[i].productId } });
							await cartService.deleteCart({ where:{ cartId:cart.cartId } });
						}
					}
					return status.success(res,200,orderData);
				}
				else {
					logger.info({ 'orderController placeOrder':LOGGER.ORDER_NOT_PLACED });
					return status.errors(res,400,{ Message:ORDER.ORDER_NOT_PLACED });
				}
			}
			else {
				logger.info({ 'orderController placeOrder':LOGGER.CART_NOT_FOUND });
				return status.errors(res,404,{ Message:CART.CART_NOT_FOUND });
			}
		}
		else {
			logger.info({ 'orderController placeOrder':LOGGER.USER_NOT_FOUND });
			return status.errors(res,404,{ Message:USER.USER_NOT_FOUND });
		}
	}
	catch (error) {
		logger.error({ 'error':error.message,'orderController placeOrder':LOGGER.INTERNAL_SERVER_ERROR });
		return status.errors(res,500,error);
	}
};

exports.cancleOrder = async (req, res) => {
	try {
		const { orderId } = req.query;
		const existingOrder = await orderService.order({ where: { orderId } });
		if (existingOrder.buyerId === res.local.userId || res.local.role === 'admin') {
			const orderDetails = await orderService.getOrderDetailsById({ where:{ orderId:orderId } });
			if (orderDetails) {
				let product = [];
				for (let i = 0;i < orderDetails.length;i++) {
					let productData = {
						productId:orderDetails[i].productId,
						quantity:orderDetails[i].quantity
					};
					product.push(productData);
					const existingProduct = await productService.getProduct({ where:{ productId:product[i].productId } });
					const totalStock = product[i].quantity += existingProduct.stock;
					await productService.updateProduct({ stock:totalStock },{ where:{ productId:existingProduct.productId } });
				}
			}
			await redisCache.deleteCache(orderId);
			await orderService.cancleOrderDetails({ where: { orderId: orderId } });
			await orderService.cancleOrder({ where:{ orderId } });
			return status.success(res,200,{ Message: ORDER.ORDER_CANCELLED, existingOrder });
		}
		else {
			logger.info({ 'orderController cancleOrder':LOGGER.ORDER_NOT_FOUND });
			return status.errors(res,404,{ Message:ORDER.ORDER_NOT_FOUND });
		}
	}
	catch (error) {
		logger.error({ 'error':error.message, 'orderController cancleOrder':LOGGER.INTERNAL_SERVER_ERROR });
		return status.errors(res,500,error);
	}
};

exports.cancleOrderDetails = async (req, res) => {
	try {
		const { Id } = req.query;
		const existingId = await orderService.getOrderDetailsById({ where:{ Id } });
		if (existingId) {
			const existingOrderId = await orderService.order({ where: { orderId:existingId[0].orderId } });
			const total = existingOrderId.totalPrice - existingId[0].totalPrice;
			await orderService.updateOrder({ totalPrice:total },{ where:{ orderId:existingOrderId.orderId } });
			const product = await productService.getProduct({ where:{ productId:existingId[0].productId } });
			product.stock += existingId[0].quantity;
			await productService.updateProduct({ stock:product.stock },{ where:{ productId:product.productId } });
			await redisCache.deleteCache(Id);
			await orderService.cancleOrderDetails({ where: { Id } });
			return status.success(res,200,{ Message: ORDER.ORDER_CANCELLED , existingId });
		}
		else {
			logger.info({ 'orderController cancleOrderDetails':LOGGER.ORDER_DETAILS_NOT_FOUND });
			return status.errors(res,404,{ Message:ORDER.ORDER_DETAILS_NOT_FOUND });
		}
	}
	catch (error) {
		logger.error({ 'error':error.message,'orderController cancleOrderDetails':LOGGER.INTERNAL_SERVER_ERROR });
		return status.errors(res,500,error);
	}
};
