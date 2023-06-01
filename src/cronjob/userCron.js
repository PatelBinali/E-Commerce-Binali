const db = require('../model/config');
const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const fs = require('fs');


exports.userCron = async () => {
	const d = new Date();
	
	const count = await db.user.count();
	const counts = JSON.stringify(count);
	fs.appendFile('D:/mini-amazon/e-commerce-binali/src/userSpent/userSpent.txt',`\n\n ${d} \n Total users: ${counts}`,function(err) {
		if (err) throw err;
		console.log('Users saved');
	});

	const deletedUser = await db.user.count({ paranoid:false, where:{ deletedAt:{ [Op.not]:null } } });
	const deletedUsers = JSON.stringify(deletedUser);
	fs.appendFile('D:/mini-amazon/e-commerce-binali/src/userSpent/userSpent.txt',`\n\n ${d} \n Deleted users: ${deletedUsers}`,function(err) {
		if (err) throw err;
		console.log('Deleted users saved');
	});

	const order = await db.order.findAll({
		attributes:{ include:['buyerId','totalPrice','createdAt'],exclude:['orderId','updatedAt','deletedAt'] },
		order:[['createdAt','DESC']],
		where:{ 
			createdAt:{
				[Op.gt]:moment().subtract(7,'days').format('YYYY-MM-DD')
			} }
	});
	const data = [];
	for (let i = 0;i < order.length;i++) {
		let arr = {
			buyerId:order[i].buyerId,
			totalPrice:order[i].totalPrice,
			createdAt:order[i].createdAt
		};
		data.push(arr);
	}
	const latestOrder = JSON.stringify(data,null,4);
	fs.appendFile('D:/mini-amazon/e-commerce-binali/src/userSpent/userSpent.txt',`\n\n ${d} \n users latest order and spents money 7 days ago: ${latestOrder}`,function(err) {
		if (err) throw err;
		console.log('Latest order and spent money 7days ago');
	});

	const user = await db.order.findAll({
		attributes:{ include:['buyerId','totalPrice','createdAt'],exclude:['orderId','updatedAt','deletedAt'] },
		order:[['createdAt','DESC']],
		where:{ 
			createdAt:{
				[Op.gt]: moment().subtract(1, 'months').format('YYYY-MM-DD')
			} }
	});
	const spentAmount = [];
	for (let i = 0;i < user.length;i++) {
		let array = {
			buyerId:user[i].buyerId,
			totalPrice:user[i].totalPrice,
			createdAt:user[i].createdAt
		};
		spentAmount.push(array);
	}
	const result = spentAmount;
	const str = JSON.stringify(result,null,4);
	fs.appendFile('D:/mini-amazon/e-commerce-binali/src/userSpent/userSpent.txt',`\n\n ${d}\n users latest order and spents money 1 month ago: ${str}`,function(err) {
		if (err) throw err;
		console.log('Latest order and spent money saved 1 month ago');
	});
};
