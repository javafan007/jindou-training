
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Classes = new Schema({
    name: String,
    course: { type: Schema.Types.ObjectId, ref: 'course' },
    teacher: { type: Schema.Types.ObjectId, ref: 'teacher' },
    studentList: [
        {
            name: String,
            contact: String,
            school: String,
            grade: String,
            address: String,
            remark: String
        }
    ],
    startDate: Date,
    weekday: Number,
    remark: String
}, { collection: 'classes' });

Classes.post('findOne', function(doc, next) {
    doc.startDate = new Date(doc.startDate).getTime();
    next();
});


module.exports = mongoose.model('classes', Classes);
