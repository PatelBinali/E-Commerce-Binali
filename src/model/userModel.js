// const uuid = require("uuid");
// const UUIDV4 = uuid.v4();

module.exports = (sequelize, Sequelize) => {
	const user = sequelize.define(
		'user',
		{
			userId: {
				type: Sequelize.STRING,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
				allowNull: false,
				unique: true
			},
			role: {
				type: Sequelize.STRING
			},
			firstName: {
				type: Sequelize.STRING
			},
			lastName: {
				type: Sequelize.STRING
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false,
				isUnique: true,
				validate: { isEmail: true }
			},
			password: {
				type: Sequelize.STRING
			},
			address: {
				type: Sequelize.STRING
			},
			phoneNumber: {
				type: Sequelize.INTEGER
			}
		},
		{
			deletedAt: 'deletedAt',
			timestamps: true,
			paranoid: true
		}
	);
	return user;
};
