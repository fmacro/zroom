const http = require('http');
const schedule = require('node-schedule');
const send = require('./send');
const logger = require('./log4js_config');

let count = 0;
let rule = new schedule.RecurrenceRule();
// rule.minute = [0, 5, 15, 20, 25, 30, 35, 40, 45, 50, 55];
rule.second = 36;

let checkDatetime = () => {
  let date = new Date();

  let hours = date.getHours();

  if (hours > 6 || hours < 1) {
    doTask();
  }
}

let doTask = () => {
  schedule.scheduleJob(rule, () => {
    let chunks = [];
    let url = 'http://sh.ziroom.com/detail/info?id=62318945&house_id=60365491';
  
    http.get(url, (res) => {
      res.on('data', (chunk) => {
        if (chunk) {
          chunks.push(chunk);
        } else {
          logger.error('请求错误');
          return;
        }
      })
      res.on('end', () => {
        let str = chunks.toString();

        if (chunks && str) {
          if (str.indexOf('success') > -1) {
            if (str.indexOf('可约看') > -1) { // 可约看

              logger.info('当前 可约看');

            } else { // 非可约看

              logger.info('当前 可预定');

              count ++;
              send(); // 发送邮件
              if (count > 5 && count < 10) {
                rule.minute = [0, 10, 20, 30, 40, 50];
              }
      
              if (count >= 10 && count < 15) {
                rule.minute = [0, 30];
              }
      
              if (count >= 15) {
                rule.minute = 12;
              }
            }
          } else {
            logger.error('请求不到正确的数据');
          }
        } else {
          logger.error('数据错误');
        }
      })
    })
  })
}

checkDatetime();
