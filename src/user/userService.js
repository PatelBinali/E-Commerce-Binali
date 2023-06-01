const db = require('../model/config');

exports.getUser = async (query) => {
	try {
		return await db.user.findOne(query);
	}
	catch (error) {
		throw error;
	}
};

exports.userList = async () => {
	try {
		return await db.user.findAll({ paranoid:false,
			attributes: { exclude: ['password','createdAt','updatedAt','deletedAt'] } 
		});
	}
	catch (error) {
		throw error;
	}
};

exports.signUp = async (user) => {
	try {
		return await db.user.create(user);
	}
	catch (error) {
		throw error;
	}
};

exports.updateUser = async (user,userId) => {
	try {
		return await db.user.update(user,{ where:{ userId } ,attributes: { exclude: ['createdAt','updatedAt','deletedAt'] } });
	}
	catch (error) {
		throw error;
	}
};

exports.deleteUser = async (query) => {
	try {
		return await db.user.destroy(query);
	}
	catch (error) {
		throw error;
	}
};

exports.addPermission = async (addPermission) => {
	try {
		return await db.permission.create(addPermission);
	}
	catch (error) {
		throw error;
	}
};

exports.allPermission = async () => {
	try {
		return await db.permission.findAll();
	}
	catch (error) {
		throw error;
	}
};

exports.getPermission = async (permissionId) => {
	try {
		return await db.permission.findOne({ where:{ permissionId },attributes: { exclude: ['createdAt','updatedAt','deletedAt'] } });
	}
	catch (error) {
		throw error;
	}
};

exports.deletePermission = async (query) => {
	try {
		return await db.permission.destroy(query);
	}
	catch (error) {
		throw error;
	}
};
