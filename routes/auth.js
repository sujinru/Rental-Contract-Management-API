const jwt = require("jsonwebtoken");

let secret = "Secret: Nobody can know this";

const isAuthorized = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        res.status(401).send("Authorization header is required");
        return;
    }

    const token = authHeader.split(" ")[1];

    let payload;
    try {
        payload = jwt.verify(token, secret);
        req.user = payload;
        next();
    } catch (e){
        res.status(401).send("Invalid token");
    }
};

const isLandlord = (req, res, next) => {
    if (!req.user || req.user.role !== 'landlord') {
        res.status(403).send("Unauthorized");
        return;
    }
    next();
};

const isTenant = (req, res, next) => {
    if (!req.user || req.user.role !== 'tenant') {
        res.status(403).send("Unauthorized");
        return;
    }
    next();
};

module.exports = {
    isAuthorized,
    isLandlord,
    isTenant,
    secret
};