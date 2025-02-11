const express = require('express');
const user_route = express();
const session = require("express-session");
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const config = require('../config/config');
const auth = require('../middleware/auth');
const userController = require("../controllers/userController");

// Session Middleware (apply once for the entire app)
user_route.use(session({
    secret: config.sessionSecret, // Ensure this is defined in your config
    resave: true,                // Save session even if unmodified
    saveUninitialized: true,     // Save uninitialized session
   
}));


user_route.use(express.static('public'));

// Set View Engine
user_route.set('view engine', 'ejs');
user_route.set('views', './views/users');

// Body Parser Middleware
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));

// Multer Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/userImages'));
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});
const upload = multer({ storage: storage });

// User Routes
user_route.get('/register', auth.isLogout, userController.loadRegister);
user_route.post('/register', upload.single('image'), userController.insertUser);

user_route.get('/verify', userController.verifyMail);

user_route.get('/', auth.isLogout, userController.loginLoad);
user_route.get('/login', auth.isLogout, userController.loginLoad);
user_route.post('/login', userController.verifyLogin);

user_route.get('/home', auth.isLogin, userController.loadHome);

user_route.get('/logout' , auth.isLogin, userController.userLogout);

user_route.get('/forget', auth.isLogout, userController.forgetLoad);

user_route.post('/forget', userController.forgetVerify);

user_route.get('/forget-password', auth.isLogout,userController.forgetPasswordLoad);

user_route.post('/forget-password',userController.resetPassword);

user_route.get('/verification',userController.verificationLoad);

user_route.post('/verification',userController.sentVerificationLink);

user_route.get('/edit', auth.isLogin,userController.editLoad);

user_route.post('/edit',upload.single('image'),userController.updateProfile);


module.exports = user_route;
