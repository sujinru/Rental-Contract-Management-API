const Contract = require('../models/contract');
const {isAuthorized, isLandlord} = require("../routes/auth");

module.exports.addContract = async (contract) => {
    return Contract.create(contract);
}

module.exports.getContracts = async () => {
    return Contract.find({});
}

module.exports.getContractByTenant = async (email) => {
    return Contract.findOne({ tenant: email });
}

module.exports.getValidContracts = async () => {
    return Contract.find({ status: 'signed' });
}

module.exports.getContractValue = async () => {
    const validContracts = await Contract.find({ status: 'signed' });
    return validContracts.reduce((acc, contract) => acc + contract.value, 0);
}

module.exports.deleteAllContracts = async () => {
    return Contract.deleteMany();
}
