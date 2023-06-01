const db = require('../model/config');

exports.getCart = async (query) => {
	try {
		return await db.cart.findOne(query);
	}
	catch (error) {
		throw error;
	}
};

exports.getAllCart = async (query) => {
	try {
		return await db.cart.findAll(query);
	}
	catch (error) {
		throw error;
	}
};

exports.getCartDetails = async (query) => {
	try {
		return await db.cartDetails.findAll(query);
	}
	catch (error) {
		throw error;
	}
};

exports.getCartDetail = async (query) => {
	try {
		return await db.cartDetails.findOne(query);
	}
	catch (error) {
		throw error;
	}
};

exports.addToCart = async (query) => {
	try {
		return await db.cart.create(query);
	}
	catch (error) {
		throw error;
	}
};

exports.addCartDetails = async (query) => {
	try {
		return await db.cartDetails.create(query);
	}
	catch (error) {
		throw error;
	}
};

exports.updateCart = async (updated,query) => {
	try {
		return await db.cart.update(updated,query);
	}
	catch (error) {
		throw error;
	}
};

exports.updateCartDetails = async (updated,query) => {
	try {
		return await db.cartDetails.update(updated,query);
	}
	catch (error) {
		throw error;
	}
};

exports.deleteCart = async (query) => {
	try {
		return await db.cart.destroy(query);
	}
	catch (error) {
		throw error;
	}
};

exports.deleteCartDetails = async (query) => {
	try {
		return await db.cartDetails.destroy(query);
	}
	catch (error) {
		throw error;
	}
};