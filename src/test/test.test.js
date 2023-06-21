/* eslint-disable no-undef */
const express = require('express');
const app = express();
const request = require('supertest');
// const db = require('../model/config');
// const user = require('../user/user');
// const product = require('../product/product');
// const cartService = require('../cart/cartService');
// const orderService = require('../order/orderService');
const router = require('../router/index');
// const { userList, getUser, allPermission, deletePermission, updateUser, deleteUser } = require('../user/userService');
// const { getProduct, allProduct, updateProduct, deleteProduct } = require('../product/productService');

app.use('/api',router);	
// eslint-disable-next-line no-undef 
describe('Test the root path', () => {
	test('It should response the GET method', async () => {
		const res = await request(app).get('/');
		expect(res.statusCode).toBe(404);
	});
});
describe('Test the connection path', () => {
	test('It should response the GET method', async () => {
		return request(app).get('/ping').then(response => {
			expect(response.statusCode).toBe(404);
		});
	});
});

describe('USERCONTROLLER', () => {
	test('should return 200 and a success message on successful login', async () => {
		const response = await request(app).post('/api/user/loginUser').send({ where:{ email: 'admin@gmail.com', password: '' } });
		expect(response.status).toBe(200);
		// expect(response.body).toHaveProperty('message', 'Login successful');
	});

	// test('should return 404 and an error message if the user does not exist', async () => {
	// 	const response = await request(app).post('/api/user/loginUser').send({ email: 'admin1@gmail.com', password: 'admin123' });

	// 	expect(response.status).toBe(404);
	// 	expect(response.body).toBe('message', 'User not found');
	// });

	// test('should return 401 and an error message if the password is incorrect', async () => {
	// 	const response = await request(app).post('/api/user/loginUser').send({ email: 'admin@gmail.com', password: 'admin124' });

	// 	expect(response.status).toBe(400);
	// 	expect(response.body).toHaveProperty('message', 'Incorrect password');
	// });
});
// user controller
// describe('USERCONTROLLER', () => {
// 	test('getUserList',async () => {
// 		return request(user).get('/api/user/getUserList').send(userList).then(response => {
// 			expect(response.statusCode).toBe(200);
// 			expect(response.body.success).toBe(true);
// 		}).catch(error => {
// 			console.log(error);
// 		});
// 	});
// 	test('get user ', async () => {
// 		return request(user).get('/api/user/getUser').send(getUser).then(response => {
// 			expect(response.statusCode).toBe(200);
// 			expect(response.body.success).toBe(true);
// 		}).catch(error => {
// 			console.log(error);
// 		});
// 	});
// 	test('login user ', async () => {
// 		const res = await request(app).post('/api/user/loginUser').send({
// 			email:'buyer@gmail.com',
// 			password:'buyer123'
// 		});
// 		expect(res.statusCode).toBe(200);
		
// 	});
// 	// describe('adminSignUp', () => {
// 	// 	test('admin sign up', async () => {
// 	// 		const user = await db.user.create({
// 	// 			role:'admin', firstName:'jest',lastName:'jest',email:'jest@gmail.com',
// 	// 			password:'jest123',confirmPassword:'jest123',address:'abc',phoneNumber:1234567890
// 	// 		});
// 	// 		expect(user).toBe(user);
// 	// 	});
// 	// });
// 	// describe('userSignUp', () => {
// 	// 	test('user sign up', async () => {
// 	// 		const user = await db.user.create({
// 	// 			role:'buyer', firstName:'jest',lastName:'jest',email:'jest@gmail.com',
// 	// 			password:'jest123',confirmPassword:'jest123',address:'abc',phoneNumber:1234567890
// 	// 		});
// 	// 		expect(user).toBe(user);
// 	// 	});
// 	// });		
// 	test('admin permission  ', async () => {
// 		const res = request(user).get('/api/user/allPermission').send(allPermission);
// 		expect(res.statusCode).toBe(200);
// 		expect(res.body.success).toBe(true);
// 	});
// 	// describe('addPermission',() => {
// 	// 	test('give status 200 if permission added',async () => {
// 	// 		const user = await userService.addPermission();
// 	// 		expect(user).toBe(user);
// 	// 	});
// 	// });
// 	test('delete admin permission  ', async () => {
// 		return request(user).delete('/api/user/deletePermission').send(deletePermission).then(response => {
// 			expect(response.statusCode).toBe(200);
// 			expect(response.body.success).toBe(true);
// 		}).catch(error => {
// 			console.log(error);
// 		});
// 	});
// 	test('update user  ', async () => {
// 		return request(user).put('/api/user/updateUser').send(updateUser).then(response => {
// 			expect(response.statusCode).toBe(200);
// 			expect(response.body.success).toBe(true);
// 		}).catch(error => {
// 			console.log(error);
// 		});
// 	});
// 	test('delete user  ', async () => {
// 		return request(user).get('/api/user/deleteUser').send(deleteUser).then(response => {
// 			expect(response.statusCode).toBe(200);
// 			expect(response.body.success).toBe(true);
// 		}).catch(error => {
// 			console.log(error);
// 		});
// 	});
// });

// // product controller
// describe('PRODUCTCONTROLLER',() => {
// 	test('get product ', async () => {
// 		return request(product).get('/api/product/getProduct').send(getProduct).then(response => {
// 			expect(response.statusCode).toBe(200);
// 			expect(response.body.success).toBe(true);
// 		}).catch(error => {
// 			console.log(error);
// 		});
// 	});
// 	test('all product ', async () => {
// 		return request(product).get('/api/product/allProduct').send(allProduct).then(response => {
// 			expect(response.statusCode).toBe(200);
// 			expect(response.body.success).toBe(true);
// 		}).catch(error => {
// 			console.log(error);
// 		});
// 	});
// 	// describe('addProduct',() => {
// 	// 	test('add one product and give status 200',async () => {
// 	// 		const product = await productService.addProduct();
// 	// 		expect(product).toBe(product);
// 	// 	});
// 	// });
// 	// test('should create a new post', async () => {
// 	// 	const res = await request(app).post('/api/posts').send({
// 	// 		userId: 1,
// 	// 		title: 'test is cool'
// 	// 	});
// 	// 	expect(res.statusCode).toEqual(201);
// 	// 	expect(res.body).toHaveProperty('post');
// 	// });
// 	test('update product ', async () => {
// 		return request(product).put('/api/product/updateProduct').send(updateProduct).then(response => {
// 			expect(response.statusCode).toBe(200);
// 			expect(response.body.success).toBe(true);
// 		}).catch(error => {
// 			console.log(error);
// 		});
// 	});
// 	test('delete product ', async () => {
// 		return request(product).get('/api/product/deleteProduct').send(deleteProduct).then(response => {
// 			expect(response.statusCode).toBe(200);
// 			expect(response.body.success).toBe(true);
// 		}).catch(error => {
// 			console.log(error);
// 		});
// 	});
// });

// // cart Controller
// describe('CARTCONTROLLER',() => {
// 	describe('getCart',() => {
// 		test('get one cart and give status 200',async () => {
// 			const res = await cartService.getCart();
// 			expect(res.statusCode).toBe(200);
// 		});
// 	});
// 	describe('getAllCart',() => {
// 		test('get all cart and give status 200',async () => {
// 			const res = await cartService.getAllCart();
// 			expect(res.statusCode).toBe(200);
// 		});
// 	});
// 	describe('getAllCartById',() => {
// 		test('get all cart by Id and give status 200',async () => {
// 			const res = await cartService.getAllCart();
// 			expect(res.statusCode).toBe(200);
// 		});
// 	});
// 	// describe('addToCart',() => {
// 	// 	test('add product to cart and give status 200',async () => {
// 	// 		const user = await cartService.addToCart();
// 	// 		expect(user).toBe(user);
// 	// 	});
// 	// });
// 	describe('updateCart',() => {
// 		test('update product to cart and give status 200',async () => {
// 			const res = await cartService.existingCartUpdate();
// 			expect(res.statusCode).toBe(200);
// 		});
// 	});
// 	describe('deleteCart',() => {
// 		test('delete cart and give status 200',async () => {
// 			const res = await cartService.deleteCart({ where:{ cartId:'96140223-882a-48f4-aeca-6f2cc73948e1' } });
// 			expect(res.statusCode).toBe(200);
// 		});
// 	});
// });

// // order Controller
// describe('ORDERCONTROLLER',() => {
// 	describe('getOrderById',() => {
// 		test('get order by Id and give status 200',async () => {
// 			const res = await orderService.getOrder();
// 			expect(res.statusCode).toBe(200);
// 		});
// 	});
// 	describe('getOrderDetailsById',() => {
// 		test('get order details by Id and give status 200',async () => {
// 			const res = await orderService.getOrderDetailsById();
// 			expect(res.statusCode).toBe(200);
// 		});
// 	});
// 	describe('getAllOrder',() => {
// 		test('get all order and give status 200',async () => {
// 			const res = await orderService.getAllOrder();
// 			expect(res.statusCode).toBe(200);
// 		});
// 	});
// 	// describe('placeOrder',() => {
// 	// 	test('place order and give status 200',async () => {
// 	// 		const user = await orderService.placeOrder();
// 	// 		expect(user).toBe(user);
// 	// 	});
// 	// });
// 	describe('cancleOrder',() => {
// 		test('cancle order and give status 200',async () => {
// 			const res = await orderService.cancleOrder({ where:{ orderId:'96140223-882a-48f4-aeca-6f2cc73948e1' } });
// 			expect(res.statusCode).toBe(200);
// 		});
// 	});
// 	describe('cancleOrderDetails',() => {
// 		test('get order details by Id and give status 200',async () => {
// 			const res = await orderService.cancleOrderDetails({ where:{ Id:'96140223-882a-48f4-aeca-6f2cc73948e1' } });
// 			expect(res.statusCode).toBe(200);
// 		});
// 	});
// });