const { Router } = require("express");
const router = Router();
const authDAO = require("../daos/auth");
const contractDAO = require("../daos/contract");
const {isAuthorized, isTenant, isLandlord} = require('./auth')

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