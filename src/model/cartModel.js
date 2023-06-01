// const uuid = require("uuid");
// const UUIDV4 = uuid.v4();

module.exports = (sequelize, Sequelize) => {
	const cart = sequelize.define('cart', {
		cartId:{
			type:Sequelize.STRING,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
			allowNull: false,
			unique:true
		},
		buyerId: {
			type: Sequelize.STRING,
			onDelete:'cascade',
			references: {
				model: 'users',
				key: 'userId'
			}
		},
		totalPrice: {
			type: Sequelize.INTEGER,
			defaultValue:0
		}
	},
	{
		deletedAt:'deletedAt',
		timestamps:true,
		paranoid:true
	}
	);
	return cart;
};
