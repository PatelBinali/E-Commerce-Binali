const joi = require('joi');


const cartValidation = (req,res,next) => {
	const cart = joi.object({
		buyerId: joi.string().required(),
		productId: joi.string().required(),
		quantity: joi.number().required(),
		totalPrice:joi.number()
	});  

	const options = {
		abortEarly: false,
		allowUnknown: true,
		stripUnknown: true
	};

	const { error, value } = cart.validate(req.body, options);
    
	if (error) {
		res.json(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
	}
	else {
		// on success replace req.body with validated value and trigger next middleware function
		req.body = value;
		next();
	}
};

module.exports = cartValidation;
