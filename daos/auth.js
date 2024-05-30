const User = require('../models/user');
const bcrypt = require('bcrypt');

module.exports.signup = async (email, password, role) => {
    if (!password) {
        return null;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        email: email,
        password: hashedPassword,
        role: role,
    })
    const savedUser = await user.save();
    return savedUser;
}

module.exports.getUser = async (email) => {
    try {
        return await User.findOne({ email });
    } catch (error) {
        throw error;
    }
};

module.exports.getAllUsers = async () => {
    return await User.find({});
}

module.exports.getAllUsersByRole = async (role) => {
    try {
        // find users whose role is equal to the role passed in
        return await User.find({ role });
    } catch (error) {
        throw error;
    }
}

module.exports.deleteAllUsers = async () => {
    try {
        return await User.deleteMany();
    } catch (error) {
        throw error;
    }
}