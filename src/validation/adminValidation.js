const joi = require('joi');


const permission = (req,res,next) => {
	const admin = joi.object({
		role: joi.string().required(),
		route: joi.string().required(),
		addPermission: joi.string().required()
	});  

	const options = {
		abortEarly: false, // pass all error and if keep true it will pass single error in validation
		allowUnknown: true, // unknown keys which are ignored
		stripUnknown: true // remove unknown elements from obj or array
	};

	const { error, value } = admin.validate(req.body, options);
    
	if (error) {
		res.json(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
	}
	else {
		// on success replace req.body with validated value and trigger next middleware function
		req.body = value;
		next();
	}
};

module.exports = permission;
