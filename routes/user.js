const { Router } = require("express");
const router = Router();
const authDAO = require("../daos/auth");
const {isAuthorized, isTenant, isLandlord, secret} = require('./auth')
const contractDAO = require("../daos/contract");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let adminSecret = "Super Secret: Only Admins can know this";

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
        res.status(400).send("Unsuccessful sign up");
    }
});

router.post("/login", async (req, res, next) => {
    const { email, password } = req.body;
    if (!password) {
        res.status(400).send("Password is required");
        return;
    }
    const user = await authDAO.getUser(email)
    if (!user){
        res.status(401).send("User not found");
        return;
    }
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

router.get("/tenants", isAuthorized, isLandlord, async (req, res, next) => {
    const users = await authDAO.getAllUsersByRole("tenant");
    res.json(users);
});

router.get("/landlords", isAuthorized, isLandlord, async (req, res, next) => {
    const users = await authDAO.getAllUsersByRole("landlord");
    res.json(users);
});

router.delete("/", isAuthorized, isLandlord, async (req, res, next) => {
    const users = await authDAO.deleteUserByEmail(req.body.email);
    res.json(users);
});

module.exports = router;