const bcrypt = require('bcrypt');

 
const bcryptPassword = async (password) => {
	const hashedPassword = await bcrypt.hash(password, 10);
	return hashedPassword;
};

module.exports = bcryptPassword;
