
module.exports = (sequelize, Sequelize) => {
	const order = sequelize.define('order', {
		orderId: {
			type: Sequelize.STRING,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
			allowNull: false
		},
		buyerId: {
			type: Sequelize.STRING,
			onDelete:'cascade',
			references: {
				model: 'carts',
				key: 'buyerId'
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
	});
	return order;
};
