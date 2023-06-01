const db = require('../model/config');
const passport = require('passport'), LocalStrategy = require('passport-local').Strategy;


passport.use(new LocalStrategy(
	async function(email, password, done) {
		try {
			const user = await db.user.findOne({ where: { email: email } });
			if (!user) {
				return done(null, false, { message: 'Incorrect email.' }); 
			}
			const passVal = user.validPassword(password);
			if (!passVal) {
				return done(null, false, { message: 'Incorrect password.' });
			}
			return done(null, user);
		}
		catch (err) {
			return done(err);
		}
	}
));
    
passport.serializeUser(function(user, done) {
	done(null, user.userId);
});

passport.deserializeUser(function(userId, done) {
	db.user.findByPk(userId).then(function(user) { done(null, user); });
});