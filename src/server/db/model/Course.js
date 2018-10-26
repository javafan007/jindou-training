
const mongoose = require('mongoose');

const Course = new mongoose.Schema({
    name: String,
    hours: Number,
    remark: String
}, { collection: 'course' });

module.exports = mongoose.model('course', Course);
