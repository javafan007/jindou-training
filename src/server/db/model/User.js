

const mongoose = require('mongoose');

const User = new mongoose.Schema({
    name: String,
    password: String,
    role: String,
    remark: String
}, { collection: 'user' });

module.exports = mongoose.model('user', User);

