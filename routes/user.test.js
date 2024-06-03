const request = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { isAuthorized, isLandlord, isTenant, secret } = require('./auth.js');
const authDAO = require("../daos/auth");
const contractDAO = require("../daos/contract");

jest.mock('jsonwebtoken');
jest.mock('../daos/auth');
jest.mock('../daos/contract');
jest.mock('bcrypt');

describe('User routes', () => {
    let app;

    beforeEach(() => {
        const express = require("express");
        app = express();
        app.use(express.json());
        app.use('/', require('./user'));
    });

    it('returns 409 if user already exists on signup', async () => {
        authDAO.getUser.mockResolvedValue(true);
        const res = await request(app).post('/signup').send({ email: 'test@test.com', password: 'password' });
        expect(res.statusCode).toEqual(409);
    });

    it('returns 401 if invalid admin key is provided on signup', async () => {
        authDAO.getUser.mockResolvedValue(false);
        const res = await request(app).post('/signup').send({ email: 'test@test.com', password: 'password', adminKey: 'invalid' });
        expect(res.statusCode).toEqual(401);
    });

    it('returns 401 if tenant does not have a contract on signup', async () => {
        authDAO.getUser.mockResolvedValue(false);
        contractDAO.getContractByTenant.mockResolvedValue([]);
        const res = await request(app).post('/signup').send({ email: 'test@test.com', password: 'password' });
        expect(res.statusCode).toEqual(401);
    });

    it('returns 200 if valid admin key is provided on signup', async () => {
        authDAO.getUser.mockResolvedValue(false);
        authDAO.signup.mockResolvedValue(true);
        const res = await request(app).post('/signup').send({ email: 'test@test.com', password: 'password', adminKey: 'Super Secret: Only Admins can know this' });
        expect(res.statusCode).toEqual(200);
    });

    it('returns 200 if tenant has a contract on signup', async () => {
        authDAO.getUser.mockResolvedValue(false);
        contractDAO.getContractByTenant.mockResolvedValue([{}]);
        authDAO.signup.mockResolvedValue(true);
        const res = await request(app).post('/signup').send({ email: 'test@test.com', password: 'password' });
        expect(res.statusCode).toEqual(200);
    });

    it('returns 400 if password is not provided on login', async () => {
        const res = await request(app).post('/login').send({ email: 'test@test.com' });
        expect(res.statusCode).toEqual(400);
    });

    it('returns 401 if user is not found on login', async () => {
        authDAO.getUser.mockResolvedValue(false);
        const res = await request(app).post('/login').send({ email: 'test@test.com', password: 'password' });
        expect(res.statusCode).toEqual(401);
    });

    it('returns 401 if password is incorrect on login', async () => {
        authDAO.getUser.mockResolvedValue({ password: 'hashedpassword' });
        bcrypt.compare.mockResolvedValue(false);
        const res = await request(app).post('/login').send({ email: 'test@test.com', password: 'password' });
        expect(res.statusCode).toEqual(401);
    });

    it('returns 200 if password is correct on login', async () => {
        authDAO.getUser.mockResolvedValue({ _id: '1', email: 'test@test.com', password: 'hashedpassword', role: 'tenant' });
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue('token');
        jwt.verify.mockReturnValue(true);
        const res = await request(app).post('/login').send({ email: 'test@test.com', password: 'password' });
        expect(res.statusCode).toEqual(200);
    });
});