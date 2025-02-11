const User = require("../models/userModel");
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const config = require("../config/config");

// Secure Password Hashing
const securePassword = async (password) => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (error) {
        console.error("Error hashing password:", error);
        throw error;
    }
};

// Function to send reset password email
const sendResetPasswordMail = async (name, email, token) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.emailUser,
                pass: config.emailPassword
            }
        });

        const resetLink = `http://127.0.0.1:3000/reset-password?token=${token}`;
        const mailOptions = {
            from: config.emailUser,
            to: email,
            subject: 'Reset Your Password',
            html: `<p>Hi ${name},</p>
                   <p>Please click the link below to reset your password:</p>
                   <a href="${resetLink}">Reset Password</a>
                   <p>If you didn't request this, please ignore this email.</p>`
        };

        await transporter.sendMail(mailOptions);
        console.log("Password reset email sent successfully");
    } catch (error) {
        console.error("Error sending reset password email:", error);
    }
};

// Load Login Page
const loadLogin = async (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.error("Error loading login page:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Verify Login
const verifyLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await User.findOne({ email });

        if (!userData) {
            return res.render("login", { message: "Email and password are incorrect." });
        }

        const passwordMatch = await bcrypt.compare(password, userData.password);
        if (!passwordMatch) {
            return res.render("login", { message: "Email and password are incorrect." });
        }

        if (userData.is_admin === 0) {
            return res.render("login", { message: "Unauthorized access." });
        }

        // ✅ Store user in session
        req.session.user_id = userData._id;
        req.session.user_email = userData.email;

        console.log("✅ Login Successful, Redirecting to /admin/home"); // Debugging

        return res.redirect("/admin/home"); // ✅ Redirect to home page
    } catch (error) {
        console.error("❌ Error in verifyLogin:", error);
        if (!res.headersSent) res.status(500).send("Internal Server Error");
    }
};

// Load Dashboard
const loadDashboard = async (req, res) => {
    try {
        if (!req.session.user?.id) {
            return res.redirect("/admin");
        }

        const userData = await User.findById(req.session.user.id);
        if (!userData) {
            return res.status(404).send("User not found");
        }

        res.render('home', { admin: userData });
    } catch (error) {
        console.error("Error loading dashboard:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Logout
const logout = async (req, res) => {
    try {
        req.session.destroy(() => {
            res.redirect('/admin');
        });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Load Forget Password Page
const forgetLoad = async (req, res) => {
    try {
        res.render('forget');
    } catch (error) {
        console.error("Error loading forget password page:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Verify Forget Password
const forgetVerify = async (req, res) => {
    try {
        const { email } = req.body;
        const userData = await User.findOne({ email });

        if (!userData || userData.is_admin === 0) {
            return res.render('forget', { message: 'Invalid email' });
        }

        const token = randomstring.generate();
        await User.updateOne({ email }, { token });

        await sendResetPasswordMail(userData.name, userData.email, token);

        res.render('forget', { message: 'Please check your email for reset instructions.' });
    } catch (error) {
        console.error('Error in forgetVerify:', error);
        res.render('forget', { message: 'Something went wrong. Please try again later.' });
    }
};

// Load Reset Password Page
const forgetPasswordLoad = async (req, res) => {
    try {
        const token = req.query.token;
        const user = await User.findOne({ token });

        if (!user) {
            return res.render('404', { message: "Invalid or expired link" });
        }

        res.render('forget-password', { user_id: user._id });
    } catch (error) {
        console.error("Error loading reset password page:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    try {
        const { password, user_id } = req.body;
        const hashedPassword = await securePassword(password);

        await User.findByIdAndUpdate(user_id, { password: hashedPassword, token: '' });

        res.redirect('/admin');
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Admin Dashboard
const adminDashboard = async (req, res) => {
    try {
        res.render('dashboard');
    } catch (error) {
        console.error("Error loading dashboard:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Export Functions
module.exports = {
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    forgetLoad,
    forgetVerify,
    forgetPasswordLoad,
    resetPassword,
    adminDashboard
};
