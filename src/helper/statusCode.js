const status = {
	success :async (res,statusCode,data) => {
		return res.status(statusCode).json({ statusCode,data });
	},
	errors:async (res,statusCode,error) => {
		// console.log('helper statuscode error, error ',error);
		// error = USER.INTERNAL_SERVER_ERROR;
		return res.status(statusCode).json({ statusCode, error:error.message });
	}
};
module.exports = status;