const { MESSAGE, LOGGER, CART, PRODUCT } = require('../helper/constant');
const db = require('../model/config');
const productService = require('./productService');
const cartService = require('../cart/cartService');
const logger = require('../helper/logger');
const status = require('../helper/statusCode');
const redisCache = require('../redis/redisCache');

exports.getProduct = async (req, res) => {
	try {
		const { productId } = req.query;
		const cacheData = JSON.parse(await redisCache.getCache(productId));
		if (cacheData === null) {
			const productData = await productService.getProduct({ where: { productId }, 
				include: [{ model: db.user }],attributes: { exclude: ['createdAt','updatedAt','deletedAt'] } });
			if (!productData) {
				logger.info({ 'productController getProduct':LOGGER.PRODUCT_NOT_FOUND });
				return status.errors(res,404,{ Message:PRODUCT.PRODUCT_NOT_FOUND });
			}
			else {
				await redisCache.setCache(productId,productData);
				return status.success(res,200,productData);
			}
		}
		else {
			return res.json(cacheData);
		}
	}
	catch (error) {
		logger.error({ 'error':error.message,'productController getProduct':LOGGER.INTERNAL_SERVER_ERROR });
		return status.errors(res,500,error);
	}
};

exports.allProduct = async (req, res) => {
	try {
		let { searchTerm,page,pageSize } = req.query;
		const products = await productService.allProduct(searchTerm,page,pageSize);
		return status.success(res,200,products);
	}
	catch (error) {
		logger.error({ 'error':error.message,'productController allProduct':LOGGER.INTERNAL_SERVER_ERROR });
		return status.errors(res,500,error);
	}
};

exports.addProduct = async (req, res) => {
	try {
		const productData = req.body;
		productData.sellerId = res.local.userId;
		const newProductData = await productService.addProduct(productData);
		await redisCache.setCache(newProductData.productId,newProductData);
		return status.success(res,200,newProductData);
	}
	catch (error) {
		logger.error({ 'error':error.message,'productController addProduct':LOGGER.INTERNAL_SERVER_ERROR });
		return status.errors(res,500,error);
	}
};

exports.updateProduct = async (req, res) => {
	try {
		const productData = req.body;
		const existingProduct = await productService.getProduct({ where:{ productId:productData.productId } });
		if (existingProduct.sellerId === res.local.userId || res.local.role === 'admin') {
			const updatedProduct = await productService.updateProduct(productData,{ where:{ productId:productData.productId } });
			const existingCart = await cartService.getCartDetails({ where:{ productId:productData.productId } });
			if (existingCart) {
				for (let i = 0;i < existingCart.length;i++) {
					existingCart[i].price = productData.price;
					const totalPrice = existingCart[i].quantity * existingCart[i].price;
					await cartService.updateCartDetails({ price:existingCart[i].price,totalPrice:totalPrice },{ where:{ productId:productData.productId } });
					
				} 
				const updatedData = await productService.getProduct({ where:{ productId:productData.productId } });
				await redisCache.setCache(updatedData.productId,updatedData);
				return status.success(res,200,{ updatedProduct,updatedData });
			}
			else {
				logger.info({ 'productController updateProduct':LOGGER.CART_NOT_FOUND });
				return status.errors(res,404,{ Message:CART.CART_NOT_FOUND });
			}
		}
		else {
			logger.info({ 'productController updateProduct':LOGGER.INVALID_DATA });
			return status.errors(res,404,{ Message:PRODUCT.INVALID_DATA });
		}
	}
	catch (error) {
		logger.error({ 'error':error.message,'productController updateProduct':LOGGER.INTERNAL_SERVER_ERROR });
		return status.errors(res,500,error);
	}
};

exports.deleteProduct = async (req, res) => {
	try {
		const { productId } = req.query;
		const existingProduct = await productService.getProduct({ where: { productId } });
		if (existingProduct.sellerId === res.local.userId || res.local.role === 'admin') {
			await productService.deleteProduct({ where:{ productId:productId,sellerId:existingProduct.sellerId } });
			await redisCache.deleteCache(productId);
			return status.success(res,200,{ Message:MESSAGE.DELETE_PRODUCT, existingProduct });
		}
		else {
			logger.info({ 'productController deleteProduct':LOGGER.PRODUCT_NOT_FOUND });
			return status.errors(res,404,{ Message:PRODUCT.PRODUCT_NOT_FOUND });
		}
	}
	catch (error) {
		logger.error({ 'error':error.message,'productController deleteProduct':LOGGER.INTERNAL_SERVER_ERROR });
		return status.errors(res,500,error);
	}
};
