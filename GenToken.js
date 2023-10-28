const jwt = require("jsonwebtoken");

// Replace 'YOUR_SECRET_KEY' with your actual secret key


const generateToken = (id) => jwt.sign(
    { id },
    process.env.SECRET_KEY,
    { expiresIn: "20d" }
);

module.exports = generateToken;
