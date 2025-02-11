const express = require("express");
const session = require("express-session");
const adminController = require("../controllers/adminController");
const auth = require("../middleware/adminAuth");

const admin_route = express();

// ✅ Configure session middleware
admin_route.use(
    session({
        secret: "your_secret_key", // Hardcoded secret key
        resave: false,
        saveUninitialized: false,
    })
);

// ✅ Middleware for parsing request data
const bodyParser = require("body-parser");
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({ extended: true }));

// ✅ Set view engine for admin pages
admin_route.set("view engine", "ejs");
admin_route.set("views", "./views/admin");

// ✅ Define Admin Routes
admin_route.get("/", auth.isLogout, adminController.loadLogin);
admin_route.post("/", adminController.verifyLogin);
admin_route.get("/home", auth.isLogin, adminController.loadDashboard);
admin_route.get("/logout", auth.isLogin, adminController.logout);
admin_route.get("/forget", auth.isLogout, adminController.forgetLoad);
admin_route.post("/forget", adminController.forgetVerify);
admin_route.get("/forget-password", auth.isLogout, adminController.forgetPasswordLoad);
admin_route.post("/forget-password", adminController.resetPassword);
admin_route.get("/dashboard", auth.isLogin, adminController.adminDashboard);

// ✅ Handle all unknown routes and redirect to admin login
admin_route.get("*", (req, res) => {
    res.redirect("/admin");
});

module.exports = admin_route;
