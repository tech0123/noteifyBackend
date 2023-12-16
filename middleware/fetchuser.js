const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const fetchuser = (req, res, next) => {
    const authtoken = req.header("auth-token");
    if (!authtoken) {
        return res.status(401).json({ errorMessage: "Please Authenticate Using A Valid Token." });
    }
    try {
        const data = jwt.verify(authtoken, JWT_SECRET);
        req.user = data.data.user;
        next(); // Call next to pass control to the next middleware
    } catch (error) {
        return res.status(401).json({ errorMessage: "Please Authenticate Using A Valid Token." });
    }
}

module.exports = fetchuser;
