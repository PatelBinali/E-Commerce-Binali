const joi = require('joi');


const checkValidation = (req,res,next) => {
	const user = joi.object({
		userId:joi.string(),
		role: joi.string().valid('admin','buyer','seller').required(),
		firstName: joi.string().required(),
		lastName: joi.string().required(),
		email: joi.string().email().required(), 
		password: joi.string().min(6).required(),
		address: joi.string().required(), 
		phoneNumber: joi.number().required(),
		confirmPassword: joi.string().min(6).valid(joi.ref('password')).required()
	});  

	const options = {
		abortEarly: false, // pass all error and if keep true it will pass single error in validation
		allowUnknown: true, // unknown keys which are ignored
		stripUnknown: true // remove unknown elements from obj or array
	};

	const { error, value } = user.validate(req.body, options);
    
	if (error) {
		res.json(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
	}
	else {
		req.body = value;
		next();
	}
};

module.exports = checkValidation;
