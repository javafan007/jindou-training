
const mongoose = require('mongoose');

const Course = new mongoose.Schema({
    name: String,
    hours: Number,
    remark: String
}, { collection: 'course', timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'} });

module.exports = mongoose.model('course', Course);
