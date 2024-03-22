const jsonwebtoken = require("jsonwebtoken");
const { expressjwt: jwt } = require("express-jwt");

exports.login = (req, res) => {
    const { username, password } = req.body;

    if (password === process.env.PASSWORD) {
        // success
        const token = jsonwebtoken.sign({ username }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        return res.json({ token: token, username: username });
    } else {
        return res.status(400).json({
            message: "Password invalid",
        });
    }
};

// check token
exports.requireLogin=jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], 
    userProperty: "auth",
}); 
