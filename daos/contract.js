const Contract = require('../models/contract');

module.exports.addContract = async (contract) => {
    return Contract.create(contract);
}

module.exports.getContracts = async () => {
    return Contract.find({});
}

module.exports.getContractByTenant = async (email) => {
    return Contract.findOne({ tenant: email });
}

module.exports.deleteAllContracts = async () => {
    return Contract.deleteMany();
}