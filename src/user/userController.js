const userService = require('./userService');
const productservice = require('../product/productService');
const cartservice = require('../cart/cartService');
const orderService = require('../order/orderService');
const bcryptPassword = require('../validation/hashPassword');
const bcrypt = require('bcrypt');
const jwtToken = require('../validation/jwtToken');
const { MESSAGE, LOGGER, ADMIN, USER } = require('../helper/constant');
const logger = require('../helper/logger');
const jwt = require('jsonwebtoken');
const status = require('../helper/statusCode');
const redisCache = require('../redis/redisCache');

exports.getUser = async (req, res) => {
	try {
		const { userId } = req.query;
		const cacheData = JSON.parse(await redisCache.getCache(userId));
		if (cacheData === null) {
			const user = await userService.getUser({ where: { userId },attributes: { exclude: ['password','createdAt','updatedAt','deletedAt'] } });
			if (!user) {
				logger.info({ 'userController getUser':LOGGER.USER_NOT_FOUND });
				return status.errors(res,404,{ message: USER.USER_NOT_FOUND });
			}
			else {
				await redisCache.setCache(userId,user);
				return status.success(res,200,user);
			}
		}
		else {
			return status.success(res,200,cacheData);
		}
	}
	catch (error) {
		logger.error({ 'error':error.message,'userController getUser':LOGGER.INTERNAL_SERVER_ERROR });
		return status.errors(res,500,error);
	}
};

exports.userList = async (req, res) => {
	try {
		const userList = await userService.userList();
		// const userList = await redisClient.GET('cacheData.');
		return status.success(res,200,userList);
	}
	catch (error) {
		logger.error({ 'error':error.message, 'userController userList':LOGGER.INTERNAL_SERVER_ERROR });
		return status.errors(res,500,error);
	}
};

exports.login = async (req, res) => {
	try {
		const email = req.body.email;
		const password = req.body.password;
		const userData = await userService.getUser({ where: { email },attributes: { exclude: ['createdAt','updatedAt','deletedAt'] } });
		if (!userData) {
			logger.info({ 'userController login':LOGGER.INVALID_DATA });
			return status.errors(res,404,{ Message:USER.INVALID_DATA });
		}
		else {
			const isMatch = await bcrypt.compare(password, userData.password);
			if (isMatch) {
				const token = await jwtToken.token(userData);
				res.cookie(token.refreshToken,{ secure: true ,httpOnly: true });
				return status.success(res,200, { userData, token });
			}
			else {
				logger.info({ 'userController login':LOGGER.INVALID_DATA });
				return status.errors(res,404,{ Message:USER.INVALID_DATA });
			}
		}
	}
	catch (error) {
		logger.error({ 'error':error.message,'userController login':LOGGER.INTERNAL_SERVER_ERROR });
		return status.errors(res,500,error);
	}
};

exports.adminSignUp = async (req, res) => {
	try {
		const user = req.body;
		const existingUser = await userService.getUser({ where: { email:user.email } });
		if (!existingUser) {
			if (user.role === 'admin') {
				const pass = await bcryptPassword(user.password);
				user.password = pass;
				const adminData = await userService.signUp(user);
				await redisCache.setCache(adminData.userId,adminData);
				return status.success(res,200,adminData);
			}
			else {
				logger.info({ 'userController adminSignUp':LOGGER.UNAUTHORIZED });
				return status.errors(res,401,{ Message:USER.UNAUTHORIZED });
			}
		}
		else {
			logger.info({ 'userController adminSignUp':LOGGER.BAD_REQUEST_EMAIL });
			return status.errors(res,400,{ Message:USER.BAD_REQUEST_EMAIL });
		}
	}
	catch (error) {
		logger.error({ 'error':error.message, 'userController adminSignUp':LOGGER.INTERNAL_SERVER_ERROR });
		return status.errors(res,500,error);
	}
};

exports.signUp = async (req, res) => {
	try {
		const user = req.body;
		const existingUser = await userService.getUser({ where: { email:user.email } });
		if (!existingUser) {
			if (user.role !== 'admin') {
				const pass = await bcryptPassword(user.password);
				user.password = pass;
				const newUser = await userService.signUp(user);
				await redisCache.setCache(newUser.userId,newUser);
				return status.success(res,200,newUser);
			}
			else {
				logger.info({ 'userController signUp':LOGGER.UNAUTHORIZED });
				return status.errors(res,401,{ Message:USER.UNAUTHORIZED });
			}
		}
		else {
			logger.info({ 'userController signUp':LOGGER.BAD_REQUEST_EMAIL });
			return status.errors(res,400,{ Message:USER.BAD_REQUEST_EMAIL });
		}
	}
	catch (error) {
		logger.error({ 'error':error.message,'userController signUp':LOGGER.INTERNAL_SERVER_ERROR });
		return status.errors(res,500,error);
	}
};

exports.updateUser = async (req, res) => {
	try {
		const user = req.body;
		const tokenUserId = res.local.userId;
		const existingUser = await userService.getUser({ where:{ userId:tokenUserId } });
		if (user.userId === existingUser.userId || res.local.role === 'admin') {
			const pass = await bcryptPassword(user.password);
			user.password = pass;
			const updatedUser = await userService.updateUser(user,user.userId);
			await userService.getUser({ where:{ userId:user.userId } });
			const updated = await userService.getUser({ where:{ userId:user.userId } });
			await redisCache.setCache(updated.userId,updated);
			return status.success(res,200,{ updatedUser,updated });
		}
		else {
			logger.info({ 'userController updateUser':LOGGER.UNAUTHORIZED });
			return status.errors(res,401,{ Message:USER.UNAUTHORIZED });
		}
	}
	catch (error) {
		logger.error({ 'error':error.message,'userController updateUser':LOGGER.INTERNAL_SERVER_ERROR });
		return status.errors(res,500,error);
	}
};

exports.deleteUser = async (req,res) => {
	try {
		const { userId } = req.query;
		const existingUser = await userService.getUser({ where:{ userId } });
		if (existingUser) {
			if (userId === res.local.userId && existingUser.role === 'seller' || res.local.role === 'admin') {
				// seller
				await productservice.deleteProduct({ where:{ sellerId:userId } });
				await redisCache.deleteCache(userId);
				await userService.deleteUser({ where:{ userId } });
				return status.success(res,200,{ message: MESSAGE.DELETE_USER ,existingUser });
			}
			else if (userId === res.local.userId && existingUser.role === 'buyer' || res.local.role === 'admin') {
				// buyer
				await cartservice.deleteCart({ where:{ buyerId:userId } });
				await cartservice.deleteCartDetails({ where:{ cartId:await cartservice.getCart({ where:{ buyerId:userId } }) } });
				await orderService.cancleOrder({ where:{ buyerId:userId } });
				await orderService.cancleOrderDetails({ where:{ orderId:await orderService.order({ where:{ buyerId:userId } }) } });
				await redisCache.deleteCache(userId);
				await userService.deleteUser({ where:{ userId } });
				return status.success(res,200,{ message: MESSAGE.DELETE_USER ,existingUser });
			}
			else {
				logger.info({ 'userController deleteUser':LOGGER.UNAUTHORIZED });
				return status.errors(res,401,{ Message:USER.UNAUTHORIZED });
			}
		}
		else {
			logger.info({ 'userController deleteUser':LOGGER.USER_NOT_FOUND });
			return status.errors(res,404,{ Message:USER.USER_NOT_FOUND });
		}
	}
	catch (error) {
		logger.error({ 'error':error.message,'userController deleteUser':LOGGER.INTERNAL_SERVER_ERROR });
		return status.errors(res,500,error);
	}
};

exports.addPermission = async (req, res) => {
	try {
		const addPermission = req.body;
		const permission = await userService.addPermission(addPermission);
		return status.success(res,200,permission);
	}
	catch (error) {
		logger.error({ 'error':error.message,'userController addPermission':LOGGER.INTERNAL_SERVER_ERROR });
		return status.errors(res,500,error);
	}
};

exports.allPermission = async (req, res) => {
	try {
		const allpermission = await userService.allPermission();
		return status.success(res,200,allpermission);
	}
	catch (error) {
		logger.error({ 'error':error.message,'userController allPermission':LOGGER.INTERNAL_SERVER_ERROR });
		return status.errors(res,500,error);
	}
};

exports.deletePermission = async (req, res) => {
	try {
		const { permissionId } = req.query;
		const permission = await userService.getPermission(permissionId);
		if (permission) {
			await userService.deletePermission({ where:{ permissionId:permissionId } });
			return status.success(res,200,{ message:ADMIN.PERMISSION_DELETED });
		}
		else {
			logger.info({ 'userController deletePermission':LOGGER.PERMISSION_NOT_FOUND });
			return status.errors(res,404,{ Message:ADMIN.PERMISSION_NOT_FOUND });
		}
	}
	catch (error) {
		logger.error({ 'error':error.message,'userController deletePermission':LOGGER.INTERNAL_SERVER_ERROR });
		return status.errors(res,500,error);
	}
};

exports.logout = async (req,res) => {
	try {
		const authHeader = req.headers['authorization'];
		jwt.sign(authHeader, '', { expiresIn: 1 } , (logout) => {
			if (logout) {
				return status.success(res,200,{ message : 'You have been Logged Out' });
			}
			else {
				return status.errors(res,400,{ message:'Error' });
			}
		});
	}
	catch (error) {
		logger.error({ 'error':error.message,'userController logout':LOGGER.INTERNAL_SERVER_ERROR });
		return status.errors(res,500,error);
	}
};
