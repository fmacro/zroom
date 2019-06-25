const log4js = require('log4js');

const config = {
  appenders: {
    file: {
      type: 'file',
      filename: `./log/${+new Date()}-zroom.log`,
      maxLogSize: 10 * 1024 * 1024, // = 10Mb
      backups: 5, // keep five backup files
      compress: true, // compress the backups
      encoding: 'utf-8',
      mode: 0o0640,
      flags: 'w+'
    },
    dateFile: {
      type: 'dateFile',
      filename: './log/more-zroom.log',
      pattern: 'yyyy-MM-dd-hh',
      compress: true
    },
    out: {
      type: 'stdout'
    }
  },
  categories: {
    default: { appenders: ['file', 'dateFile', 'out'], level: 'trace' }
  }
}

log4js.configure(config);

const logger = log4js.getLogger('自如');

module.exports = logger;
