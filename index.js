const express = require('express');
const app = express();
const router = require('./src/router');
const jwt = require('jsonwebtoken');
const { PORT, JWT } = require('./src/helper/constant');
const jwtConfig = require('./src/validation/jwtToken');
const swaggerJsdoc = require('./swagger.json');
const swaggerUi = require('swagger-ui-express');
const cron = require('node-cron');
const { userCron } = require('./src/cronjob/userCron');
const { productCron } = require('./src/cronjob/productCron');
const passport = require('passport');
const session = require('express-session');
app.use(express.urlencoded({
	extended: true 
})
);
app.use(express.json());

app.use('/api', router);

app.get('/ping', (req, res) => {
	res.send('pong');
});

app.get('/', (req, res) => {
	res.send('invalid route');
});

cron.schedule('0 */1 * * *', () => {
	userCron();
	productCron();
});

app.post('/refresh', (req, res) => {
	if (req.cookies) {
		// Destructuring refreshToken from cookie
		const refreshToken = req.cookies;
		console.log(refreshToken);
		// Verifying refresh token
		jwt.verify(refreshToken,JWT.SECRET,
			(error) => {
				if (error) {
					// Wrong Refesh Token
					return res.status(406).json({ message: 'Unauthorized' });
				}
				else {
					// Correct token we send a new access token
					const accessToken = jwtConfig.token(refreshToken,JWT.SECRET, {
						expiresIn: JWT.EXPIRES
					});
					return res.json({ accessToken });
				}
			});
	}
	else {
		return res.status(406).json({ message: 'Unauthorizedd' });
	}
});

app.use('*/swagger',	swaggerUi.serve, swaggerUi.setup(swaggerJsdoc)
);

app.listen(PORT, () => {
	console.log(`Express running → PORT ${PORT}`);
});

app.use(session({
	secret: 'secret',
	resave: true ,
	saveUninitialized: true 
}));
app.use(passport.initialize()); 
app.use(passport.session());   

