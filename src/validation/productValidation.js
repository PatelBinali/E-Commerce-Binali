const joi = require('joi');


const productValidation = (req,res,next) => {
	const product = joi.object({
		productId: joi.string(),
		productName: joi.string().required(),
		description: joi.string().required(), 
		category: joi.string().required(),
		brand: joi.string().required(), 
		price: joi.number().min(1).required(), 
		stock: joi.number().min(1).required(),
		searchTerm: joi.string().optional(),
		page:joi.number().min(1).optional(),
		pageSize: joi.number().min(1).optional() 
	});  

	const options = {
		abortEarly: false,
		allowUnknown: true,
		stripUnknown: true
	};

	const { error ,value } = product.validate(req.body,req.query, options);
    
	if (error) {
		res.json(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
	}
	else {
		req.query = {
			searchTerm: value.searchTerm,
			page: value.page,
			pageSize: value.pageSize
		};
		req.body = {
			productId:value.productId,
			productName:value.productName,
			description:value.description,  
			category: value.category,
			brand:value.brand,  
			price: value.price,
			stock:value.stock
		};
		// on success replace req.body with validated value and trigger next middleware function
		next();
	}
};

module.exports = productValidation;
