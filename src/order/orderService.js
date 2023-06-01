const db = require('../model/config');

exports.getOrder = async (orderId) => {
	try {
		return await db.order.findByPk(orderId,{ where: { orderId },paranoid:false,include: [{ model: db.orderDetails }] });
	}
	catch (error) {
		throw error;
	}
};

exports.getAllOrder = async () => {
	try {
		return await db.order.findAll({
			include: [{ model: db.orderDetails }]
		});
	}
	catch (error) {
		throw error;
	}
};

exports.placeOrder = async (placeOrder) => {
	try {
		return await db.order.create(placeOrder);
	}
	catch (error) {
		throw error;
	}
};

exports.updateOrder = async (query,updated) => {
	try {
		const total = await db.order.update(query,updated);
		return total;
	}
	catch (error) {
		throw error;
	}
};

exports.order = async (query) => {
	try {
		return await db.order.findOne(query);
	}
	catch (error) {
		throw error;
	}
};

exports.orderDetailsPlaced = async (query) => {
	try {
		return await db.order.findOne(query);
	}
	catch (error) {
		throw error;
	}
};

exports.cancleOrder = async (query) => {
	try {
		return await db.order.destroy(query);
	}
	catch (error) {
		throw error;
	}
};

exports.orderDetails = async (orderDetails) => {
	try {
		return await db.orderDetails.bulkCreate(orderDetails);
	}
	catch (error) {
		throw error;
	}
};

exports.getOrderDetailsById = async (query) => {
	try {
		return await db.orderDetails.findAll(query);
	}
	catch (error) {
		throw error;
	}
};

exports.cancleOrderDetails = async (query) => {
	try {
		return await db.orderDetails.destroy(query);
	}
	catch (error) {
		throw error;
	}
};
