const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema({
    tenant: { type: String, required: true, unique: true},
    value: {
        type: Number,
        required: true,
        validate: {
            validator: function(v) {
                return Number.isInteger(v) && v > 0;
            },
            message: '{VALUE} is not a positive integer'
        },
    },
    term: {
        type: Number,
        required: true,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value'
        },
        min: [1, 'Term must be at least 1 day']
    },
    status: {
        type: String,
        enum: ['waiting_for_sign', 'signed', 'rejected'],
        default: 'waiting_for_sign'
    },
    room:{
        type: Number,
        required: true,
        validate: {
            validator: function(v) {
                return Number.isInteger(v) && v >= 1 && v <= 10; // room number required to be 1-10
            },
            message: '{VALUE} is not an integer value between 1 and 10'
        },
    }
});

module.exports = mongoose.model("users", contractSchema);
