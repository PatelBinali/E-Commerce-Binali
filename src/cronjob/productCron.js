const { Op } = require('sequelize');
const db = require('../model/config');
const fs = require('fs');
const moment = require('moment');

exports.productCron = async () => {
	const d = new Date();
	const productCount = await db.product.count();
	let totalPrdouct = JSON.stringify(productCount);
	fs.appendFile('D:/mini-amazon/e-commerce-binali/src/productCron/productAdd.txt',`\n\n ${d} \n Total Products: ${totalPrdouct}`,function(err) {
		if (err) throw err;
		console.log('Total Product saved');
	});


	const deletedProduct = await db.product.count({ paranoid:false, where:{ deletedAt:{ [Op.not]:null } } });
	const deletedProducts = JSON.stringify(deletedProduct);
	fs.appendFile('D:/mini-amazon/e-commerce-binali/src/productCron/productAdd.txt',`\n\n ${d} \n Deleted products: ${deletedProducts}`,function(err) {
		if (err) throw err;
		console.log('Deleted product saved');
	});


	const product = await db.product.findAll({
		attributes:{ include:['productId','sellerId','createdAt'],exclude:['productName','description','category','brand','price','stock'] },
		product:[['createdAt','DESC']],
		where:{ 
			createdAt:{
				[Op.gt]:moment().subtract(7,'days').format('YYYY-MM-DD')
			} }
	});
	const data = [];
	for (let i = 0;i < product.length;i++) {
		let arr = {
			productId:product[i].productId,
			sellerId:product[i].sellerId,
			createdAt:product[i].createdAt
		};
		data.push(arr);
	}
	const latestProduct = JSON.stringify(data,null,4);
	fs.appendFile('D:/mini-amazon/e-commerce-binali/src/productCron/productAdd.txt',`\n\n ${d} \n users latest product of 7 days ago: ${latestProduct}`,function(err) {
		if (err) throw err;
		console.log('Latest product of 7days ago');
	});


	const productList = await db.product.findAll({
		attributes:{ include:['productId','sellerId','createdAt'],exclude:['productName','description','category','brand','price','stock'] },
		product:[['createdAt','DESC']],
		where:{ 
			createdAt:{
				[Op.gt]:moment().subtract(1,'months').format('YYYY-MM-DD')
			} }
	});
	const array = [];
	for (let i = 0;i < productList.length;i++) {
		let arr = {
			productId:productList[i].productId,
			sellerId:productList[i].sellerId,
			createdAt:productList[i].createdAt
		};
		array.push(arr);
	}
	const monthProduct = JSON.stringify(array,null,4);
	fs.appendFile('D:/mini-amazon/e-commerce-binali/src/productCron/productAdd.txt',`\n\n ${d} \n users latest product of 1 months ago: ${monthProduct}`,function(err) {
		if (err) throw err;
		console.log('Latest product of 7days ago');
	});
};