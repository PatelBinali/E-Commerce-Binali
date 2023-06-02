const status = {
	success :async (res,statusCode,data) => {
		return res.status(statusCode).json({ statusCode,data });
	},
	errors:async (res,statusCode,error) => {
		return res.status(statusCode).json({ statusCode, error:error.message });
	}
};
module.exports = status;