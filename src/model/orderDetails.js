// const uuid = require("uuid");
// const UUIDV4 = uuid.v4();

module.exports = (sequelize, Sequelize) => {
	const orderDetails = sequelize.define('orderDetails', {
		Id: {
			type: Sequelize.STRING,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
			allowNull: false
		},
		orderId: {
			type: Sequelize.STRING,
			onDelete:'cascade',
			references: {
				model: 'orders',
				key: 'orderId'
			}
		},
		productId: {
			type: Sequelize.STRING,
			onDelete:'cascade',
			references: {
				model: 'cartDetails',
				key: 'productId'
			}
		},
		price: {
			type: Sequelize.INTEGER
		},
		quantity: {
			type: Sequelize.INTEGER
		},
		totalPrice: {
			type: Sequelize.INTEGER
		}
	},
	{
		deletedAt:'deletedAt',
		timestamps:true,
		paranoid:true
	});
	return orderDetails;
};
