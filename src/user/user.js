const express = require('express');
const router = express.Router();
const userController = require('./userController');
const checkValidation = require('../validation/userValidation');
const auth = require('../middleware/authMiddleware');
const adminValidation = require('../validation/adminValidation');
const passport = require('passport'); 
require('../middleware/passport');

router.get('/getUser',auth,userController.getUser);

router.get('/getUserList',auth,userController.userList);

router.post('/loginUser',passport.authenticate('local'),userController.login);

router.post('/adminSignUp',checkValidation,userController.adminSignUp);

router.post('/signUpUser',userController.signUp);

router.get('/allPermission',auth,userController.allPermission);

router.post('/addPermission',[auth,adminValidation],userController.addPermission);

router.delete('/deletePermission',auth,userController.deletePermission);

router.put('/updateUser',[auth,checkValidation],userController.updateUser);

router.delete('/deleteUser',auth,userController.deleteUser);

router.post('/logout',auth,userController.logout);

module.exports = router;
