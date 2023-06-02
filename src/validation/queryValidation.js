const joi = require('joi');


const queryValidation = (req,res,next) => {
	const query = joi.object({
		// searchTerm: joi.string(),
		page:joi.number().min(1),
		pageSize: joi.number().min(1) 
	});  

	const options = {
		abortEarly: false,
		allowUnknown: true,
		stripUnknown: true
	};

	const { error } = query.validate(req.query, options);
    
	if (error) {
		res.json(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
	}
	else {
		next();
	}
};

module.exports = queryValidation;
