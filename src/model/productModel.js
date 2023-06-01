// const uuid = require("uuid");
// const UUIDV4 = uuid.v4();

module.exports = (sequelize, Sequelize) => {
	const product = sequelize.define('product', {
		productId: {
			type: Sequelize.STRING,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
			allowNull: false,
			unique:true
		},
		sellerId: {
			type: Sequelize.STRING,
			onDelete:'cascade',
			references: {
				model: 'users',
				key: 'userId'
			}
		},
		productName: {
			type: Sequelize.STRING
		},
		description: {
			type: Sequelize.STRING
		},
		category: {
			type: Sequelize.STRING
		},
		brand: {
			type: Sequelize.STRING
		},
		price: {
			type: Sequelize.INTEGER
		},
		stock: {
			type: Sequelize.INTEGER
		}
	},
	{
		deletedAt:'deletedAt',
		timestamps:true,
		paranoid:true
	}
	);
	return product;
};
