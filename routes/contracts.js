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

router.put('/reject', isAuthorized, isTenant, async (req, res, next) => {
    const contract = await contractsDAO.getContractByTenant(req.user.email);
    if (!contract) {
        res.status(404).send("Contract not found");
    } else {
        contract.status = "rejected";
        await contract.save();
        res.sendStatus(200);
    }
});

router.put('/sign', isAuthorized, isTenant, async (req, res, next) => {
    const contract = await contractsDAO.getContractByTenant(req.user.email);
    if (!contract) {
        res.status(404).send("Contract not found");
    } else {
        contract.status = "signed";
        contract.signed_date = new Date();
        await contract.save();
        res.sendStatus(200);
    }
});

router.put('/update', isAuthorized, isLandlord, async (req, res, next) => {
    const { tenant, value, term, room } = req.body;
    if (!tenant) {
        res.status(400).send("Tenant email is required");
        return;
    }
    const contract = await contractsDAO.getContractByTenant(tenant);
    if (value) {
        contract.value = value;
    }
    if (room) {
        contract.room = room;
    }
    if (term) {
        contract.term = term;
    }
    contract.status = "waiting_for_sign";
    await contract.save();
    res.sendStatus(200);
});

router.delete('/one', isAuthorized, isLandlord, async (req, res, next) => {
    const deletedContract = await contractsDAO.deleteContractByTenant(req.body.tenant);
    if (deletedContract.deletedCount === 0) {
        res.status(500).send("Failed to delete contract");
    } else {
        res.sendStatus(200);
    }
});

router.get("/ValidContracts", isAuthorized, isLandlord, async (req, res, next) => {
    const term = req.body.term;
    const contracts = await contractsDAO.getContractsByTerm({term: term, today: new Date() });
    res.json(contracts);
});

router.get("/ExpiredContracts", isAuthorized, isLandlord, async (req, res, next) => {
    const contracts = await contractsDAO.getExpiredContracts({today: new Date() });
    res.json(contracts);
});

router.get("/ContractValue", isAuthorized, isLandlord, async (req, res, next) => {
    const term = req.body.term;
    const values = await contractsDAO.getContractValueByTerm({term: term, today: new Date()});
    res.json(values);
});


module.exports = router;