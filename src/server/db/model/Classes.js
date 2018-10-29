
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
    signTable: [
        {
            date: Date,
            hours: Number,
            studentList: [
                {
                    name: String,
                    status: Number
                }
            ]
        }
    ],
    startDate: Date,    //开班时间
    classtime: String,      //上课时间
    hoursOfSign: Number,  //每次签到多少课时
    weekday: Number,    //每周几上课
    fees: Number,       //课时费
    status: '',         //班级状态
    remark: String
}, { collection: 'classes', timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'} });

module.exports = mongoose.model('classes', Classes);
