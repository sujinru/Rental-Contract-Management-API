const { Router } = require("express");
const router = Router();
const contractsDAO = require('../daos/contract');
const {isAuthorized, isTenant, isLandlord} = require('./auth')

router.post('/create', isAuthorized, isLandlord, async (req, res, next) => {
    const newContract = await contractsDAO.addContract(req.body);
    res.status(200).json(newContract);
});

router.get('/', isAuthorized, isLandlord, async (req, res, next) => {
    const contracts = await contractsDAO.getContracts();
    res.status(200).json(contracts);
});

module.exports = router;