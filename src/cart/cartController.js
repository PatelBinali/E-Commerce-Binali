const cartService = require('./cartService');
const userService = require('../user/userService');
const productService = require('../product/productService');
const { MESSAGE, LOGGER, CART, PRODUCT, USER } = require('../helper/constant');
const logger = require('../helper/logger');
const status = require('../helper/statusCode');
const redisCache = require('../redis/redisCache');

exports.getCartById = async (req, res) => {
	try {
		const { cartId } = req.query;
		const cacheData = JSON.parse(await redisCache.getCache(cartId));
		if (cacheData === null) {
			const cart = await cartService.getCart({ where:{ cartId } });
			const getCartData = await cartService.getCartDetails({ where: { cartId },attributes: { exclude: ['createdAt','updatedAt','deletedAt'] } });
			await redisCache.setCache(getCartData.cartId,getCartData);
			return status.success(res,200,{ getCartData,totalPrice:cart.totalPrice });
		}
		else {
			return status.success(res,200,cacheData);
		}
	}
	catch (error) {
		logger.error({ 'error':error.message,'cartController getCartById':LOGGER.INTERNAL_SERVER_ERROR });
		return status.errors(res,500,error);
	}
};

exports.addToCart = async (req, res) => {
	try {
		const cartData = req.body;
		if (cartData.buyerId === res.local.userId || res.local.role === 'admin') {
			const buyer = await userService.getUser({ where:{ userId:cartData.buyerId } });
			if (buyer) {
				const existingCart = await cartService.getCart({ where:{ buyerId:cartData.buyerId } });
				if (!existingCart) {
					const addToCart = await cartService.addToCart({ buyerId:cartData.buyerId });
					const productData = await productService.getProduct({ where:{ productId:cartData.productId } });
					if (productData) {
						const cartDetails = await cartService.addCartDetails(
							{
								cartId:addToCart.cartId,
								productId:productData.productId,
								price:productData.price,
								quantity:cartData.quantity,
								totalPrice:productData.price * cartData.quantity 
							} 
						);
						const total = addToCart.totalPrice += cartDetails.totalPrice;
						if (cartDetails.quantity > productData.stock) {
							logger.info({ 'cartController addToCart':LOGGER.OUT_OF_STOCK });
							return status.errors(res,404,{ Message:CART.OUT_OF_STOCK });
						}
						else {
							await cartService.updateCart({ totalPrice:total },{ where:{ cartId:addToCart.cartId } });
							await redisCache.setCache(addToCart.cartId,addToCart);
							return status.success(res,200,addToCart);
						}
					}
					else {
						logger.info({ 'cartController addToCart':LOGGER.PRODUCT_NOT_FOUND });
						return status.errors(res,404,{ Message:PRODUCT.PRODUCT_NOT_FOUND });
					}
				}
				else {
					const existingCartDetails = await cartService.getCartDetails({ where:{ cartId:existingCart.cartId } });
					const productData = await productService.getProduct({ where:{ productId:cartData.productId } });
					let array = [];
					for (let i = 0;i < existingCartDetails.length;i++) {
						let cart = existingCartDetails[i];
						array.push(cart);
					}
					let obj = array.find(o => o.productId === cartData.productId);
					if (obj) {
						const quantity = obj.quantity += cartData.quantity;
						const newPrice = cartData.quantity * obj.price;
						const total = obj.totalPrice += newPrice;
						if (quantity > productData.stock) {
							logger.info({ 'cartController addToCart':LOGGER.OUT_OF_STOCK });
							return status.errors(res,404,{ Message:CART.OUT_OF_STOCK });
						}
						else {
							await cartService.updateCartDetails({ totalPrice:total,quantity:quantity },
								{ where:{ cartId:existingCart.cartId, productId:obj.productId } });
							const newTotal = existingCart.totalPrice += newPrice;
							await cartService.updateCart({ totalPrice:newTotal },{ where:{ cartId:existingCart.cartId } });
						}
					}
					else {
						const data = {
							cartId:existingCart.cartId,
							productId:productData.productId,
							price:productData.price,
							quantity:cartData.quantity,
							totalPrice:productData.price * cartData.quantity 
						};
						if (data.quantity > productData.stock) {
							logger.info({ 'cartController addToCart':LOGGER.OUT_OF_STOCK });
							return status.errors(res,404,{ Message:CART.OUT_OF_STOCK });
						}
						else {
							const cartDetails = await cartService.addCartDetails(data);	
							const totals = existingCart.totalPrice += cartDetails.totalPrice;
							await cartService.updateCart({ totalPrice:totals },{ where:{ cartId:existingCart.cartId } });
						}
					}
					await redisCache.setCache(existingCart.cartId,existingCart);						
					return status.success(res,200,existingCart);
				}
			}
			else {
				logger.info({ 'cartController addToCart':LOGGER.USER_NOT_FOUND });
				return status.errors(res,404,{ Message:USER.USER_NOT_FOUND });
			}
		}
		else {
			logger.info({ 'cartController addToCart':LOGGER.UNAUTHORIZED });
			return status.errors(res,401,{ Message:USER.UNAUTHORIZED });
		}
	}
	catch (error) {
		logger.error({ 'error':error.message, 'cartController addToCart':LOGGER.INTERNAL_SERVER_ERROR });
		return status.errors(res,500,error);
	}
};

exports.updateCart = async (req, res) => {
	try {
		const cartData = req.body;
		const checkProduct = await productService.getProduct({ where:{ productId:cartData.productId } });
		if (checkProduct) {
			const cartProduct = await cartService.getCart({ where: { cartId: cartData.cartId } });
			if (cartProduct.buyerId === res.local.userId || res.local.role === 'admin') {
				cartData.price = checkProduct.price;
				cartData.totalPrice = cartData.quantity * checkProduct.price;
				if (cartData.quantity > checkProduct.stock) {
					logger.info({ 'cartController updateCart':LOGGER.OUT_OF_STOCK });
					return status.errors(res,404,{ Message:CART.OUT_OF_STOCK });
				}
				else {
					const updateData = await cartService.updateCartDetails(cartData,{ where:{ cartId:cartData.cartId, productId:cartData.productId } });
					const allCartDetails = await cartService.getCartDetails({ where:{ cartId:cartData.cartId } });
					let sum = 0;
					for (let i = 0;i < allCartDetails.length;i++) {
						sum += allCartDetails[i].totalPrice;
					}
					await cartService.updateCart({ totalPrice:sum },{ where:{ cartId:cartData.cartId } });
					const updated = await cartService.getCartDetails({ where:{ cartId:cartData.cartId, productId:cartData.productId } });
					await redisCache.setCache(updated.cartId,updated);
					return status.success(res,200,{ updateData,updated });
				}
			}
			else {
				logger.info({ 'cartController updateCart':LOGGER.PRODUCT_NOT_FOUND });
				return status.errors(res,404,{ Message:PRODUCT.PRODUCT_NOT_FOUND });
			}
		}
		else {
			logger.info({ 'cartController updateCart':LOGGER.PRODUCT_NOT_FOUND });
			return status.errors(res,404,{ Message:PRODUCT.PRODUCT_NOT_FOUND });
		}
	}
	catch (error) {
		logger.error({ 'error':error.message, 'cartController updateCart':LOGGER.INTERNAL_SERVER_ERROR });
		return status.errors(res,500,error);
	}
};

exports.deleteCart = async (req, res) => {
	try {
		const { cartId } = req.query;
		const cart = await cartService.getCart({ where: { cartId } });
		if (cart.buyerId === res.local.userId || res.local.role === 'admin') {
			await cartService.deleteCartDetails({ where:{ cartId:cartId } });
			await redisCache.deleteCache(cartId);
			await cartService.deleteCart({ where:{ cartId } });
			return status.success(res,200,{ message: MESSAGE.DELETE_CART, cart });
		}
		else {
			logger.info({ 'cartController deleteCart':LOGGER.CART_NOT_FOUND });
			return status.errors(res,404,{ Message:CART.CART_NOT_FOUND });
		}
	}
	catch (error) {
		logger.error({ 'error':error.message,'cartController deleteCart':LOGGER.INTERNAL_SERVER_ERROR });
		return status.errors(res,500,error);
	}
};

exports.deleteCartDetails = async (req, res) => {
	try {
		const { Id } = req.query;
		const cartDetails = await cartService.getCartDetail({ where: { Id } });
		const cart = await cartService.getCart({ where:{ cartId:cartDetails.cartId } });
		if (cart.buyerId === res.local.userId || res.local.role === 'admin') {
			const existingCart = await cartService.getCart({ where:{ cartId:cartDetails.cartId } });
			existingCart.totalPrice -= cartDetails.totalPrice;
			await cartService.updateCart({ totalPrice:existingCart.totalPrice },{ where:{ cartId:existingCart.cartId } });
			await redisCache.deleteCache(Id);
			await cartService.deleteCartDetails({ where:{ Id } });
			return status.success(res,200,{ message: MESSAGE.DELETE_CART ,cartDetails });
		}
		else {
			logger.info({ 'cartController deleteCartDetails':LOGGER.CART_NOT_FOUND });
			return status.errors(res,404,{ Message:CART.CART_NOT_FOUND });
		}
	}
	catch (error) {
		logger.error({ 'error':error.message,'cartController deleteCartDetails':LOGGER.INTERNAL_SERVER_ERROR });
		return status.errors(res,500,error);
	}
};
