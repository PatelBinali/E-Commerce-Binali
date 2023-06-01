const jwt = require('jsonwebtoken');
const jwtConfig = require('../helper/constant');

const token = async (userData) => {
	const generateToken = {
		userId: userData.userId,
		firstName: userData.firstName,
		lastName: userData.lastName,
		email: userData.email
	};
	const accessToken = jwt.sign(generateToken, jwtConfig.JWT.SECRET, {
		expiresIn: jwtConfig.JWT.EXPIRES
	});
	const refreshToken = jwt.sign(generateToken,jwtConfig.JWT.SECRET);
	return { accessToken,refreshToken };
  
};
module.exports = { token };
