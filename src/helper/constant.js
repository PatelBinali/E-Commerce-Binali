require('dotenv').config();

const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT;
const JWT = {
	SECRET: process.env.SECRET,
	EXPIRES: process.env.EXPIRES
};
const DB_DATA = {
	DB_NAME: process.env.DB_NAME,
	DB_HOST: process.env.DB_HOST,
	DB_USER: process.env.DB_USER,
	DB_PASSWORD: process.env.DB_PASSWORD,
	DB_DIALECT: process.env.DB_DIALECT
};

const LOGGER = {
	USER_NOT_FOUND:'Invalid user',
	PRODUCT_NOT_FOUND:'Product Not Found',
	ORDER_NOT_PLACED:'Order Is Not Placed',
	PRODUCT_CART_NOT_FOUND:'Product Is Not Found In Cart',
	BUYER_NOT_FOUND:'Buyer\'s Cart Not Found',
	ORDER_NOT_FOUND:'Order Not Found',
	ORDER_DETAILS_NOT_FOUND:'Order Details Not Found',
	CART_NOT_FOUND:'Cart Not Found',
	INTERNAL_SERVER_ERROR:'Internal Server Error',
	UNAUTHORIZED:'Unauthorized',
	INVALID_DATA: 'Invalid Credentials',
	BAD_REQUEST_PASSWORD: 'Password And Confirm Password Not Match',
	BAD_REQUEST_EMAIL:'Email Exists',
	PERMISSION_NOT_FOUND:'Permission Not Found',
	OUT_OF_STOCK:'Requested Quantity Is More Than Product Stock'
};
const MESSAGE = {
	DELETE_USER:'Deleted User',
	DELETE_CART:'Deleted Product From Cart',
	DELETE_PRODUCT:'Product deleted',
	UNAUTHORIZED:'You Are Unauthorized'
};
const ADMIN = {
	PERMISSION_DELETED :'Permission Deleted',
	PERMISSION_NOT_FOUND:'Permission Not Found'
};
const USER = {
	BAD_REQUEST_PASSWORD: 'Password And Confirm Password Not Match',
	BAD_REQUEST_EMAIL:'Email Exists',
	UNAUTHORIZED: 'You Are Unauthorized',
	USER_NOT_FOUND:'Invalid User',
	INVALID_DATA: 'Invalid credentials',
	INTERNAL_SERVER_ERROR:'Internal Server Error'
};

const CART = {
	INTERNAL_SERVER_ERROR:'Internal Server Error',
	PRODUCT_NOT_FOUND:'Product Not Found',
	CART_NOT_FOUND:'Cart Not Found',
	OUT_OF_STOCK:'Requested Quantity Is More Than Product Stock'
};

const PRODUCT = {
	INTERNAL_SERVER_ERROR:'Internal Server Error',
	INVALID_DATA: 'Invalid Credentials',
	PRODUCT_NOT_FOUND:'Product Not Found'
};

const ORDER = {
	INTERNAL_SERVER_ERROR:'Internal Server Error',
	ORDER_CANCELLED:'Order Cancelled',
	ORDER_NOT_PLACED:'Order Is Not Placed',
	CART_NOT_FOUND:'Cart Not Found',
	ORDER_NOT_FOUND:'Order Not Found',
	INVALID_DATA:'Invalid Buyer',
	ORDER_DETAILS_NOT_FOUND:'Order Details Not Found'
};
module.exports = { NODE_ENV,PORT,JWT,DB_DATA,MESSAGE,ADMIN,USER,CART,PRODUCT,ORDER,LOGGER };
