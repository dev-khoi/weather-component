import jwt from "jsonwebtoken";

// authenticate the token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }
    jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Invalid or expired token" });
        }

        req.user = user;
        console.log(req.user);
        next();
    });
};

// generate the access token for user
// ideally expires at least 10 minutes
const generateAccessToken = (userId: BigInt) => {
    return jwt.sign({ userId: userId.toString() }, process.env.ACCESS_SECRET_TOKEN, {
        expiresIn: "300s",
    });
};

const generateRefreshToken = (userId: BigInt) => {
    return jwt.sign({ userId: userId.toString() }, process.env.REFRESH_SECRET_TOKEN, {
        expiresIn: "15d"
    });
};
export { authenticateToken, generateAccessToken, generateRefreshToken };
