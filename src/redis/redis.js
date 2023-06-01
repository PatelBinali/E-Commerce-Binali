const redisClient = require('./redisConfig');

if (redisClient.connect) {
	console.log('hi');
}
else {
	console.error('Redis client is not connected');
}
