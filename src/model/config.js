const Sequelize = require('sequelize');
const database = require('../helper/constant');
const sequelize = new Sequelize(database.DB_DATA.DB_NAME,database.DB_DATA.DB_USER, database.DB_DATA.DB_PASSWORD, {
	host: database.DB_DATA.DB_HOST,
	dialect: database.DB_DATA.DB_DIALECT,
	operatorsAliases: 0,
	logging : false,

	pool: {
		max: 5,
		min: 0,
		idle: 10000
	}
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('./userModel')(sequelize, Sequelize);
db.product = require('./productModel')(sequelize,Sequelize);
db.permission = require('./permission')(sequelize,Sequelize);
db.cart = require('./cartModel')(sequelize,Sequelize);
db.order = require('./orderModel')(sequelize,Sequelize);
db.orderDetails = require('./orderDetails')(sequelize,Sequelize);
db.cartDetails = require('./cartDetails')(sequelize,Sequelize);

//  Associations
db.product.belongsTo(db.user, { foreignKey: 'sellerId',targetKey:'userId' });
db.user.hasOne(db.product, { foreignKey: 'sellerId',targetKey:'userId',onDelete:'CASCADE',hooks:true });

db.cart.belongsTo(db.user, { foreignKey: 'buyerId',targetKey:'userId' });
db.user.hasOne(db.cart, { foreignKey: 'buyerId',targetKey:'userId' });

db.cartDetails.belongsTo(db.product,{ foreignKey:'productId',targetKey:'productId' });
db.product.hasOne(db.cartDetails,{ foreignKey:'productId',targetKey:'productId' });

db.cartDetails.belongsTo(db.cart,{ foreignKey:'cartId',targetKey:'cartId' });
db.cart.hasOne(db.cartDetails,{ foreignKey:'cartId',targetKey:'cartId' });

db.order.belongsTo(db.cart,{ foreignKey:'buyerId',targetKey:'buyerId' });
db.cart.hasOne(db.order,{ foreignKey:'buyerId',targetKey:'buyerId' });

db.orderDetails.belongsTo(db.cartDetails,{ foreignKey:'productId',targetKey:'productId' });
db.cartDetails.hasOne(db.orderDetails,{ foreignKey:'productId',targetKey:'productId' });
 
db.orderDetails.belongsTo(db.order,{ foreignKey:'orderId',targetKey:'orderId' });
db.order.hasOne(db.orderDetails,{ foreignKey:'orderId',targetKey:'orderId' });

//      sync db
// db.sequelize.sync({force:true})
db.sequelize.sync({ force: false })
	.then(() => {
		console.log('D B - C O N N E C T E D');
	})
	.catch((error) => {
		console.log('D B  E R R O R' + error);
	});

module.exports = db;
