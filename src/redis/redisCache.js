const redisClient = require('./redisConfig');

exports.getCache = async (userId) => {
	try {
		const cacheData = await redisClient.GET(`cacheData.${userId}`);
		console.log('cache get');
		return cacheData;
	}
	catch (err) {
		return err;
	}
};

exports.setCache = async (userId,user) => {
	try {
		const cacheData = await redisClient.SET(`cacheData.${userId}`,JSON.stringify(user));
		console.log('cache set');
		return cacheData;
	}
	catch (err) {
		return err;
	}
};

exports.deleteCache = async (userId) => {
	try {
		const cacheData = await redisClient.DEL(`cacheData.${userId}`);
		console.log('cache delete');
		return cacheData;
	}
	catch (err) {
		return err;
	}
};