const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        required: true,
        enum: ["landlord", "tenant"],
    }
});

module.exports = mongoose.model("user", userSchema);
