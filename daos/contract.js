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

module.exports.getContractValueByTerm = async ({term, today}) => {
    if (term === undefined) {
        term = 100000;
    }

    const validContracts = await Contract.find({ status: 'signed' });
    return validContracts.reduce((acc, contract) => {
        const signedDate = contract.signed_date;
        const validUntil = new Date(signedDate);
        validUntil.setMonth(validUntil.getMonth() + contract.term);
        const termDate = new Date(today.getTime());
        termDate.setMonth(termDate.getMonth() + term);

        if (validUntil > today && validUntil <= termDate) {
            return acc + contract.value;
        }
        return acc;
    }, 0);
}

module.exports.getContractsByTerm = async ({term, today}) => {
    if (term === undefined) {
        term = 100000;
    }

    const validContracts = await Contract.find({ status: 'signed' });
    return validContracts.filter(contract => {
        const signedDate = contract.signed_date;
        const validUntil = new Date(signedDate);
        validUntil.setMonth(validUntil.getMonth() + contract.term);
        const termDate = new Date(today.getTime());
        termDate.setMonth(termDate.getMonth() + term);
        return validUntil > today && validUntil <= termDate;
    });
}

module.exports.getExpiredContracts = async ({today}) => {
    const validContracts = await Contract.find({ status: 'signed' });
    return validContracts.filter(contract => {
        const signedDate = contract.signed_date;
        const validUntil = new Date(signedDate);
        validUntil.setMonth(validUntil.getMonth() + contract.term);
        return validUntil <= today;
    });

}

module.exports.deleteAllContracts = async () => {
    return Contract.deleteMany();
}
