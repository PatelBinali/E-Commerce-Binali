module.exports = (sequelize, Sequelize) => {
	const cartDetails = sequelize.define('cartDetails', {
		Id: {
			type: Sequelize.STRING,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
			allowNull: false
		},
		cartId: {
			type: Sequelize.STRING,
			onDelete:'cascade',
			references: {
				model: 'carts',
				key: 'cartId'
			}
		},
		productId: {
			type: Sequelize.STRING,
			onDelete:'cascade',
			references: {
				model: 'products',
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
	return cartDetails;
};
