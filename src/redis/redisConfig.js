const redis = require('redis');

const redisClient = redis.createClient({
	host: 'localhost', // Redis server host
	port: 6379 // Redis server port
});

redisClient.connect();
module.exports = redisClient;

// Check if the Redis client is connected
// Execute Redis commands
// Handle the error appropriately
