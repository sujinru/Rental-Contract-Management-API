const request = require('supertest');
const contractsDAO = require('../daos/contract');
const { isAuthorized, isTenant, isLandlord } = require('./auth.js');

jest.mock('../daos/contract');
jest.mock('./auth.js');

describe('Contract routes', () => {
    let app;

    beforeEach(() => {
        const express = require("express");
        app = express();
        app.use(express.json());
        app.use('/', require('./contracts'));

        // Mock middleware functions
        isAuthorized.mockImplementation((req, res, next) => next());
        isLandlord.mockImplementation((req, res, next) => next());
        isTenant.mockImplementation((req, res, next) => next());
    });

    it('returns 200 when creating a contract as a landlord', async () => {
        isLandlord.mockImplementationOnce((req, res, next) => next());
        const res = await request(app).post('/create').send({ tenant: 'tenant@test.com', value: 1000, term: 12, room: '101' });
        expect(res.statusCode).toEqual(200);
    });

    it('returns 200 when getting all contracts as a landlord', async () => {
        isLandlord.mockImplementationOnce((req, res, next) => next());
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
    });

    it('returns 404 when a tenant tries to reject a non-existent contract', async () => {
        isTenant.mockImplementationOnce((req, res, next) => {
            req.user = { email: 'tenant@test.com' }; // Mock the user object
            next();
        });
        contractsDAO.getContractByTenant.mockResolvedValue(null);
        const res = await request(app).put('/reject');
        expect(res.statusCode).toEqual(404);
    });

    it('returns 200 when a tenant signs a contract', async () => {
        isTenant.mockImplementationOnce((req, res, next) => {
            req.user = { email: 'tenant@test.com' }; // Mock the user object
            next();
        });
        contractsDAO.getContractByTenant.mockResolvedValue({
            _id: '1',
            tenant: 'tenant@test.com',
            landlord: 'landlord@test.com',
            value: 1000,
            term: 12,
            room: '101',
            status: 'waiting_for_sign',
            signed_date: null,
            save: jest.fn().mockResolvedValue(true)
        });
        const res = await request(app).put('/sign');
        expect(res.statusCode).toEqual(200);
    });

    it('returns 400 when updating a contract without providing a tenant', async () => {
        isLandlord.mockImplementationOnce((req, res, next) => next());
        const res = await request(app).put('/update').send({ value: 1000, term: 12, room: '101' });
        expect(res.statusCode).toEqual(400);
    });

    it('returns 200 when deleting a contract as a landlord', async () => {
        isLandlord.mockImplementationOnce((req, res, next) => next());
        contractsDAO.deleteContractByTenant.mockResolvedValue({ deletedCount: 1 });
        const res = await request(app).delete('/one').send({ tenant: 'tenant@test.com' });
        expect(res.statusCode).toEqual(200);
    });

    it('returns 500 when failing to delete a contract as a landlord', async () => {
        isLandlord.mockImplementationOnce((req, res, next) => next());
        contractsDAO.deleteContractByTenant.mockResolvedValue({ deletedCount: 0 });
        const res = await request(app).delete('/one').send({ tenant: 'tenant@test.com' });
        expect(res.statusCode).toEqual(500);
    });

    it('returns 401 when a tenant tries to delete a contract', async () => {
        isLandlord.mockImplementationOnce((req, res, next) => {
            const error = new Error("Unauthorized");
            error.status = 401;
            next(error);
        });
        const res = await request(app).delete('/one').send({ tenant: 'tenant@test.com' });
        expect(res.statusCode).toEqual(401);
    });

    it('returns 200 when getting valid contracts as a landlord', async () => {
        isLandlord.mockImplementationOnce((req, res, next) => next());
        const res = await request(app).get('/ValidContracts').send({ term: 12 });
        expect(res.statusCode).toEqual(200);
    });

    it('returns 200 when getting expired contracts as a landlord', async () => {
        isLandlord.mockImplementationOnce((req, res, next) => next());
        const res = await request(app).get('/ExpiredContracts');
        expect(res.statusCode).toEqual(200);
    });

    it('returns 200 when getting contract value by term as a landlord', async () => {
        isLandlord.mockImplementationOnce((req, res, next) => next());
        const res = await request(app).get('/ContractValue').send({ term: 12 });
        expect(res.statusCode).toEqual(200);
    });

    it('returns 200 when updating a contract as a landlord', async () => {
        isLandlord.mockImplementationOnce((req, res, next) => next());
        contractsDAO.getContractByTenant.mockResolvedValue({
            _id: '1',
            tenant: 'tenant@test.com',
            landlord: 'landlord@test.com',
            value: 1000,
            term: 12,
            room: '101',
            status: 'waiting_for_sign',
            signed_date: null,
            save: jest.fn().mockResolvedValue(true)
        });
        const res = await request(app).put('/update').send({ tenant: 'tenant@test.com', value: 2000, term: 24, room: '102' });
        expect(res.statusCode).toEqual(200);
    });

    it('returns 400 when updating a contract without providing a tenant', async () => {
        isLandlord.mockImplementationOnce((req, res, next) => next());
        const res = await request(app).put('/update').send({ value: 2000, term: 24, room: '102' });
        expect(res.statusCode).toEqual(400);
    });
});