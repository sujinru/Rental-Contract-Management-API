const Contract = require('../models/contract');
const contractDao = require('../daos/contract');

jest.mock('../models/contract');

describe('Contract DAO', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should add a contract', async () => {
        const contract = { tenant: 'test@test.com', value: 1000 };
        Contract.create.mockResolvedValue(contract);

        const result = await contractDao.addContract(contract);

        expect(Contract.create).toHaveBeenCalledTimes(1);
        expect(result).toEqual(contract);
    });

    it('should get all contracts', async () => {
        const contracts = [{ tenant: 'test1@test.com', value: 1000 }, { tenant: 'test2@test.com', value: 2000 }];
        Contract.find.mockResolvedValue(contracts);

        const result = await contractDao.getContracts();

        expect(Contract.find).toHaveBeenCalledTimes(1);
        expect(result).toEqual(contracts);
    });

    it('should get a contract by tenant email', async () => {
        const contract = { tenant: 'test@test.com', value: 1000 };
        Contract.findOne.mockResolvedValue(contract);

        const result = await contractDao.getContractByTenant('test@test.com');

        expect(Contract.findOne).toHaveBeenCalledTimes(1);
        expect(result).toEqual(contract);
    });

    it('should delete a contract by tenant email', async () => {
        Contract.deleteOne.mockResolvedValue({ deletedCount: 1 });

        const result = await contractDao.deleteContractByTenant('test@test.com');

        expect(Contract.deleteOne).toHaveBeenCalledTimes(1);
        expect(result.deletedCount).toEqual(1);
    });

    it('should get contract value by term', async () => {
        const contracts = [{ tenant: 'test1@test.com', value: 1000, status: 'signed', signed_date: new Date(), term: 12 }, { tenant: 'test2@test.com', value: 2000, status: 'signed', signed_date: new Date(), term: 12 }];
        Contract.find.mockResolvedValue(contracts);

        const result = await contractDao.getContractValueByTerm({ term: 12, today: new Date() });

        expect(Contract.find).toHaveBeenCalledTimes(1);
        expect(result).toEqual(3000);
    });

    it('should get contracts by term', async () => {
        const contracts = [{ tenant: 'test1@test.com', value: 1000, status: 'signed', signed_date: new Date(), term: 12 }, { tenant: 'test2@test.com', value: 2000, status: 'signed', signed_date: new Date(), term: 12 }];
        Contract.find.mockResolvedValue(contracts);

        const result = await contractDao.getContractsByTerm({ term: 12, today: new Date() });

        expect(Contract.find).toHaveBeenCalledTimes(1);
        expect(result).toEqual(contracts);
    });

    it('should get expired contracts', async () => {
        const contracts = [{ tenant: 'test1@test.com', value: 1000, status: 'signed', signed_date: new Date(), term: 12 }, { tenant: 'test2@test.com', value: 2000, status: 'signed', signed_date: new Date(), term: 12 }];
        Contract.find.mockResolvedValue(contracts);

        const result = await contractDao.getExpiredContracts({ today: new Date() });

        expect(Contract.find).toHaveBeenCalledTimes(1);
        expect(result).toEqual([]);
    });

    it('should delete all contracts', async () => {
        Contract.deleteMany.mockResolvedValue({ deletedCount: 2 });

        const result = await contractDao.deleteAllContracts();

        expect(Contract.deleteMany).toHaveBeenCalledTimes(1);
        expect(result.deletedCount).toEqual(2);
    });
});