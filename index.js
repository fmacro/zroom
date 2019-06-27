const http = require('http');
const schedule = require('node-schedule');
const send = require('./send');
const logger = require('./log4js_config');

let count = 0;
let rule = new schedule.RecurrenceRule();
rule.minute = [0, 5, 15, 20, 25, 30, 35, 40, 45, 50, 55];

function checkDatetime () {
  let date = new Date();

  let hours = date.getHours();

  // if (hours > 6) {
    doTask();
  // }
}
function doTask () {
  schedule.scheduleJob(rule, function(){
    let chunks = [];
    let url = 'http://sh.ziroom.com/detail/info?id=62318945&house_id=60365491';
  
    http.get(url, function (res) {
      res.on('data', function (chunk) {
        chunks.push(chunk);
      })
      res.on('end', function () {
        let buf = chunks.toString();
        let obj = JSON.parse(buf);

        if (obj.code === 200) {
          let status = obj.data.air_part.vanancy.status;

          logger.info(`code: ${obj.code}; status: ${status}; count: ${count}; rule: ${JSON.stringify(rule)};`);

          // 当前可预订时，发送邮件
          if (status === '可约看') {

          } else {
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
          logger.error(`code: ${obj.code}; count: ${count}; rule: ${JSON.stringify(rule)};`);
        }
      })
    })
  })
}

checkDatetime();