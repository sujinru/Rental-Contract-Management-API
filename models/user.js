const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    password: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    role: {
        type: String,
        required: true,
        enum: ['tenant', 'landlord']
    }
});

module.exports = mongoose.model("user", userSchema);
