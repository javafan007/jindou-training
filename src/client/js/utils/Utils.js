

const Utils =  {

    //计算学期起始日期范围
    buildPeriod (totalHours,         //总课时数
                 hoursOfLearning,   //学员一次上课的课时数
                 startDate,     //第一天上课日期
                 weekday        //周几上课
    ) {
        console.log('---', startDate);
        const learningTotalDay = Math.ceil(totalHours / hoursOfLearning);   //上课次数
        const days = 365 * 2;                   //教学周期最长2年

        let learningDateList = [];
        for(let day = 0; day < days; day++) {   //遍历连续的每一天
            let newDate = _getNewDate(startDate, day);

            if(newDate.getDay() === weekday) { //为上课的日期
                learningDateList.push({ date: newDate, hours: hoursOfLearning });
            }

            if(learningDateList.length >= learningTotalDay) {
                //计算最后一课的课时数
                learningDateList[learningDateList.length - 1].hours = totalHours % hoursOfLearning;

                return learningDateList;
            }
        }
        return learningDateList;

        function _getNewDate(startDate, inc = 0) {
            const start = new Date(startDate);
            start.setDate(start.getDate() + inc);

            return start;
        }
    },

    getWeekDay (weekday) {
        return ['日', '一', '二', '三', '四', '五', '六'][weekday];
    }
};

export default Utils;