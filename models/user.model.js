const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const User = new schema({

    email: {
        trim: true,
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    
}, { timestamps: true })


module.exports = mongoose.model('users', User);