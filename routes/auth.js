const { Router } = require("express");
const router = Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authDAO = require("../daos/auth");
const contractDAO = require("../daos/contract");

let secret = "Secret: Nobody can know this";
let adminSecret = "Super Secret: Only Admins can know this";

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

router.post("/signup", async (req, res, next) => {
    const { email, password, adminKey } = req.body;

    const userDuplicate = await authDAO.getUser(email);
    if (userDuplicate) {
        res.status(409).send("User already exists");
        return;
    }

    let user;
    if (adminKey) {
        if (adminKey === adminSecret) {
            user = await authDAO.signup(email, password, "landlord");
        } else {
            res.status(401).send("Invalid Admin Key");
            return;
        }
    } else {
        const existingContract = await contractDAO.getContractByTenant(email);
        if (!existingContract || existingContract.length === 0) {
            res.status(401).send("Tenant must have a contract");
            return;
        } else {
            user = await authDAO.signup(email, password, "tenant");
        }

    }

    if (user) {
        res.status(200).send(user);
    } else {
        res.sendStatus(400);
    }
});

router.post("/login", async (req, res, next) => {
    const { email, password } = req.body;
    if (!password) {
        res.status(400).send("Password is required");
        return;
    }
    const user = await authDAO.getUser(email)
    const storedHash = user.password;
    const valid = await bcrypt.compare(password, storedHash);
    if (valid) {
        const role = user.role;
        const token = jwt.sign({_id: user._id, email: email, role: role }, secret);
        const valid = jwt.verify(token, secret);
        if (!valid){
            res.status(401).send("Invalid token");
            return;
        }
        res.status(200).json({ token });
    } else {
        res.sendStatus(401);
    }
});

router.get("/tenants", async (req, res, next) => {
    const users = await authDAO.getAllUsersByRole("tenant");
    res.json(users);
});

router.get("/landlords", async (req, res, next) => {
    const users = await authDAO.getAllUsersByRole("landlord");
    res.json(users);
});

router.delete("/", async (req, res, next) => {
    const users = await authDAO.deleteAllUsers();
    res.json(users);
});

module.exports = {
    isAuthorized,
    isLandlord,
    isTenant,
    router
};