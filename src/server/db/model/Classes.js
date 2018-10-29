
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
    signInfo: { type: Map, of: Number},
    signTable: [
        {
            date: Date,
            studentList: [
                {
                    name: String,
                    status: Number
                }
            ]
        }
    ],
    startDate: Date,
    endDate: Date,      //最后一天的上课日期
    classtime: String,  //上课时间
    hoursOfSign: Number,  //每次签到多少课时
    weekday: Number,    //每周几上课
    fees: Number,       //课时费
    status: '',         //班级状态
    remark: String
}, { collection: 'classes' });


module.exports = mongoose.model('classes', Classes);
