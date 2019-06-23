const nodemailer  = require("nodemailer");
const config = require("./config");

// 参数：发件人，收件人，主题，正文（支持html格式）
function handleSend (aliasName, tos, subject, body) {
  const smtpTransport = nodemailer.createTransport({
    host: 'smtp.163.com',
    secureConnection: true, // use SSL
    secure: true,
    port: 465,
    auth: {
      user: config.user,
      pass: config.pass
    }
  })

  smtpTransport.sendMail({
    //from    : '标题别名 <foobar@latelee.org>',
    from    : aliasName + ' ' + '<' + from + '>',
    //'li@latelee.org, latelee@163.com',//收件人邮箱，多个邮箱地址间用英文逗号隔开
    to      : tos,
    subject : subject,//邮件主题
    //text    : body,
    html    : body
  }, function(err, res) {
    if (err) {
      console.log('error: ', err);
    }
  })
}

function send() {
  handleSend(
    '自如房子可以预约了！',
    "582718643@qq.com",
    '赶紧去APP预约吧！',
    'Goooooooooooooooooo!'
  )
}

// send()
module.exports = send;
