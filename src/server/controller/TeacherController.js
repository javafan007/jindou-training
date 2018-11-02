
const Model = require('../db/model/Teacher');
const Classes = require('../db/model/Classes');
const moment = require('moment');
const Excel = require('exceljs');
const fs = require('fs');

module.exports = self = {
    async create (ctx)  {
        ctx.body = await Model.insert(ctx.request.body);
    },

    async update (ctx) {
        ctx.body = await Model.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    },

    async findList (ctx) {
        ctx.body = await Model.find({});
    },

    async findSignTablesByTeacherId (ctx) {
        ctx.body = await _feesOfTeacher(ctx.params.id, ctx.query.date);
    },

    async exportExcel (ctx) {
        let stat = await _feesOfTeacher(ctx.params.id, ctx.query.date);

        let workbook = new Excel.Workbook();
        let ws = workbook.addWorksheet("课时费");

        ws.addRow([formatDate(ctx.query.date, 'YYYY年MM月') + ' 总课时：' + stat.totalHours + '个， 总课时费：' + stat.totalFees + '元']);
        const cellRange = "A1:B1:C1:D1:E1";
        ws.mergeCells(cellRange);
        const fills = {type: "pattern", pattern:"solid", fgColor:{argb:"FFFFAAAA"}};
        cellRange.split(':').forEach( item => ws.getCell(item).fill = fills );
        ws.getColumn(1).width = 20;


        stat.classesList.forEach( ({ cls, signTable }) => {

            ws.addRow();
            ws.addRow([cls.name + '（课时数：' + cls.totalHours + '个，总课时费：' + cls.totalFees + '元）']);

            let headerRow = [...['日期', '课时'], ...cls.studentList.map( item => item.name )];
            ws.addRow(headerRow);

            signTable.forEach( dateRow => {
                let dataRow = [];
                dataRow.push(moment(dateRow.date).format('YYYY年MM月DD日'));
                dataRow.push(dateRow.hours);
                dateRow.studentList.forEach( it => dataRow.push(it.status * dateRow.hours) );

                ws.addRow(dataRow);
            });
        });

        var path = __dirname + '/tempFile.xlsx';

        await workbook.xlsx.writeFile(path);
        ctx.set('Content-disposition','attachment;filename=' + formatDate(ctx.query.date, 'YYYY-MM') + '.xlsx');
        ctx.body = fs.createReadStream(path);
    },

    async findClassesByTeacherId (ctx) {
        ctx.body = await Classes.find({teacher: ctx.params.id})
            .populate('course');
    },

    async deleteById (ctx) {
        ctx.body = await Model.findByIdAndRemove(ctx.params.id);
    },
};

function formatDate(dateStr, pattern) {
    return moment(dateStr && new Date(dateStr) || new Date()).format(pattern)
}

//计算总课时和课时费
async function _feesOfTeacher (teacherId, date) {

    let d = date && new Date(date) || new Date();
    let start = moment(new Date(d.getFullYear(), d.getMonth(), 1)).format('YYYY-MM-DD');
    let end = moment(new Date(d.getFullYear(), d.getMonth() + 1, 0)).format('YYYY-MM-DD');

    let classes = await Classes.find({
        teacher: teacherId,
        'signTable.date': {$gt: start, $lte: end}
    });
    classes = JSON.parse( JSON.stringify(classes) );

    let classesList = classes.map( cls => ({ cls: cls, signTable: cls.signTable.filter(isBetween) }) );
    let totalHours = 0;
    let totalFees = 0;
    classesList.forEach( ({ cls, signTable }) => {
        const { hoursOfSign, fees } = cls;

        //本月总签到次数
        let totalSign = 0;
        signTable.forEach( dateRow => {
            totalSign += dateRow.studentList.filter( stu => stu.status === 1 ).length;
        });

        cls.totalHours = totalSign * hoursOfSign;   //班级总课时
        cls.totalFees = cls.totalHours * fees;  //班级总课时费

        totalHours += cls.totalHours;  //本月所有班级总课时
        totalFees += cls.totalFees;    //本月所有班级总课时费
    });

    return { totalHours, totalFees, classesList };

    function isBetween (item) {
        let d = moment(item.date).format('YYYY-MM-DD');
        return d > start && d < end;
    }
}