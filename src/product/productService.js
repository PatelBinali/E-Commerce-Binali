const db = require('../model/config');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.getProduct = async (query) => {
	try {
		return await db.product.findOne(query);
	}
	catch (error) {
		throw error;
	}
};

exports.allProduct = async (searchTerm,page,pageSize) => {
	try {
		const limit = parseInt(pageSize);
		const offset = (parseInt(page) - 1) * limit;
		const result = await db.product.findAndCountAll({
			where: {
				[Op.or]: [
					{ productName: { [Op.like]: `%${searchTerm}%` } },
					{ category: { [Op.like]: `%${searchTerm}%` } },
					{ brand: { [Op.like]: `%${searchTerm}%` } },
					{ price: { [Op.like]: `%${searchTerm}%` } },
					{ description: { [Op.like]: `%${searchTerm}%` } }
				]
			},
			paranoid:false,
			searchTerm,
			limit,
			offset,
			attributes: { exclude: ['createdAt','updatedAt','deletedAt'] }
		});  
		const totalPages = Math.ceil(result.count / limit);
		return {
			rows: result.rows,
			count: result.count,
			totalPages,
			currentPage: parseInt(page)
		};
	}
	catch (error) {
		throw error;
	}
};

exports.addProduct = async (productData) => {
	try {
		return await db.product.create(productData);
	}
	catch (error) {
		throw error;
	}
};

exports.updateProduct = async (update,query) => {
	try {
		return await db.product.update(update,query);
	}
	catch (error) {
		throw error;
	}
};

exports.deleteProduct = async (query) => {
	try {
		return await db.product.destroy(query);
	}
	catch (error) {
		throw error;
	}
};
