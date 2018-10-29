
const mongoose = require('mongoose');

const Teacher = new mongoose.Schema({
    name: String,
    wechat: String,
    phone: String,
    course: String,
    remark: String
}, { collection: 'teacher', timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'} });

module.exports = mongoose.model('teacher', Teacher);
