// const Joi = require("joi");

const validateJoi = (schema) => {
	(req, res, next) => {
		const options = {
			abortEarly: false, // pass all error and if keep true it will pass single error in validation
			allowUnknown: true, // unknown keys which are ignored
			stripUnknown: true // remove unknown elements from obj or array
		};
		const { error } = schema.validate(req.body, options);

		if (error) {
			next(
				`Validation error: ${error.details.map((x) => x.message).join(', ')}`
			);
		}
		else {
			// on success replace req.body with validated value and trigger next middleware function
			next();
		}
	};
};
module.exports = validateJoi;
