// const nodemailer = require("nodemailer");
// const config = require("./config"); // Ensure config.js is correctly set

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: config.emailUser,
//         pass: config.emailPassword
//     },
//     debug: true,  // Enable debugging
//     logger: true  // Log SMTP messages
// });

// const mailOptions = {
//     from: config.emailUser,
//     to: "akshitasoni5510@gmail.com", // Replace with your actual email
//     subject: "Test Email",
//     text: "This is a test email from Nodemailer."
// };

// // Send the email
// transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//         console.log("Error:", error);
//     } else {
//         console.log("Email sent successfully: " + info.response);
//     }
// });
