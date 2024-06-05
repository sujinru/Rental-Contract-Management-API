const bcrypt = require('bcrypt');
const User = require('../models/user');
const authDao = require('../daos/auth');

jest.mock('bcrypt');
jest.mock('../models/user');

describe('Auth DAO', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should sign up a user', async () => {
        const hashedPassword = 'hashedPassword';
        bcrypt.hash.mockResolvedValue(hashedPassword);
        const user = { email: 'test@test.com', password: hashedPassword, role: 'landlord' };
        User.mockImplementation(() => ({ save: () => Promise.resolve(user) }));

        const result = await authDao.signup('test@test.com', 'password', 'landlord');

        expect(bcrypt.hash).toHaveBeenCalledTimes(1);
        expect(result).toEqual(user);
    });

    it('should not sign up a user without password', async () => {
        const result = await authDao.signup('test@test.com', null, 'landlord');

        expect(bcrypt.hash).toHaveBeenCalledTimes(0);
        expect(result).toBeNull();
    });

    it('should get a user by email', async () => {
        const user = { email: 'test@test.com', password: 'hashedPassword', role: 'landlord' };
        User.findOne.mockResolvedValue(user);

        const result = await authDao.getUser('test@test.com');

        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(result).toEqual(user);
    });

    it('should get all users', async () => {
        const users = [{ email: 'test1@test.com', password: 'hashedPassword1', role: 'landlord' }, { email: 'test2@test.com', password: 'hashedPassword2', role: 'tenant' }];
        User.find.mockResolvedValue(users);

        const result = await authDao.getAllUsers();

        expect(User.find).toHaveBeenCalledTimes(1);
        expect(result).toEqual(users);
    });

    it('should get all users by role', async () => {
        const users = [{ email: 'test1@test.com', password: 'hashedPassword1', role: 'landlord' }, { email: 'test2@test.com', password: 'hashedPassword2', role: 'landlord' }];
        User.find.mockResolvedValue(users);

        const result = await authDao.getAllUsersByRole('landlord');

        expect(User.find).toHaveBeenCalledTimes(1);
        expect(result).toEqual(users);
    });

    it('should delete a user by email', async () => {
        User.deleteOne.mockResolvedValue({ deletedCount: 1 });

        const result = await authDao.deleteUserByEmail('test@test.com');

        expect(User.deleteOne).toHaveBeenCalledTimes(1);
        expect(result.deletedCount).toEqual(1);
    });
});