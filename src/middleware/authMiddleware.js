const jwt = require('jsonwebtoken');
const { JWT, LOGGER, USER } = require('../helper/constant');
const db = require('../model/config');
const logger = require('../helper/logger');
const status = require('../helper/statusCode');

const authenticateToken = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	if (authHeader !== undefined) {
		const bearer = authHeader.split(' ');
		const bearerToken = bearer[1];
		jwt.verify(bearerToken, JWT.SECRET, async (err, token) => {
			if (token) {
				const userId = token.userId;
				const route = req.originalUrl.split('?')[0];
				const user = await db.user.findOne({ where: { userId } });
				const role = user.role;
				const permission = await db.permission.findOne({
					where: {
						role: role,
						route: route
					}
				});
				if (!permission) {
					logger.info(LOGGER.UNAUTHORIZED);
					return status.errors(res,401,{ Message:USER.UNAUTHORIZED });
				}
				token.role = role;
				res.local = token;
				next();
			}
			else {
				return status.errors(res,401,{ Message:USER.UNAUTHORIZED });
			}
		});
	}
	else {
		logger.info(LOGGER.UNAUTHORIZED);
		return status.errors(res,401,{ Message:USER.UNAUTHORIZED });
	}
};
module.exports = authenticateToken;
