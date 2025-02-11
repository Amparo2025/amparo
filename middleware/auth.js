const isLogin = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            return next();  // Proceed to the next middleware or route handler
        } else {
            return res.redirect('/');  // Redirect if not logged in
        }
     
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Server Error');  // Send an error response if something goes wrong
    }
}

const isLogout = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            return res.redirect('/home');  // Redirect if already logged in
        }
        return next();  // Proceed if not logged in
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Server Error');  // Handle any error
    }
}

module.exports = {
    isLogin,
    isLogout
}
