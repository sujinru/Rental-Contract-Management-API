const request = require('supertest');
const express = require("express");
const jwt = require('jsonwebtoken');
const { isAuthorized, isLandlord, isTenant, secret } = require('./auth.js');

jest.mock('jsonwebtoken');

let app = express();
app.use(express.json());
app.get('/testAuth', isAuthorized, (req, res) => res.status(200).send('Authorized'));
app.get('/testLandlord', isAuthorized, isLandlord, (req, res) => res.status(200).send('Authorized'));
app.get('/testTenant', isAuthorized, isTenant, (req, res) => res.status(200).send('Authorized'));

describe('Authorization middleware', () => {
    it('returns 401 if no authorization header is present', async () => {
        const res = await request(app).get('/testAuth');
        expect(res.statusCode).toEqual(401);
    });

    it('returns 401 if authorization header does not start with Bearer', async () => {
        const res = await request(app).get('/testAuth').set('Authorization', 'NotBearer token');
        expect(res.statusCode).toEqual(401);
    });

    it('returns 401 if token is invalid', async () => {
        jwt.verify.mockImplementation(() => { throw new Error(); });
        const res = await request(app).get('/testAuth').set('Authorization', 'Bearer token');
        expect(res.statusCode).toEqual(401);
    });

    it('calls next if token is valid', async () => {
        jwt.verify.mockImplementation(() => ({ role: 'landlord' }));
        const res = await request(app).get('/testAuth').set('Authorization', 'Bearer token');
        expect(res.statusCode).toEqual(200);
    });
});

describe('Landlord middleware', () => {
    it('returns 403 if user role is not landlord', async () => {
        jwt.verify.mockImplementation(() => ({ role: 'tenant' }));
        const res = await request(app).get('/testLandlord').set('Authorization', 'Bearer token');
        expect(res.statusCode).toEqual(403);
    });

    it('calls next if user role is landlord', async () => {
        jwt.verify.mockImplementation(() => ({ role: 'landlord' }));
        const res = await request(app).get('/testLandlord').set('Authorization', 'Bearer token');
        expect(res.statusCode).toEqual(200);
    });
});

describe('Tenant middleware', () => {
    it('returns 403 if user role is not tenant', async () => {
        jwt.verify.mockImplementation(() => ({ role: 'landlord' }));
        const res = await request(app).get('/testTenant').set('Authorization', 'Bearer token');
        expect(res.statusCode).toEqual(403);
    });

    it('calls next if user role is tenant', async () => {
        jwt.verify.mockImplementation(() => ({ role: 'tenant' }));
        const res = await request(app).get('/testTenant').set('Authorization', 'Bearer token');
        expect(res.statusCode).toEqual(200);
    });
});