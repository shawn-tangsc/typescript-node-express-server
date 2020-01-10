import * as express from 'express';
import log4js from 'log4js';

class Log4js {

  private _logger!: any;

  constructor() {
    this.init();
    this._logger = log4js.getLogger('logger');
  }

  public use(app: express.Application) {
    app.use(log4js.connectLogger(this._logger, {
      level: 'info',
      format: ':method :url response-time=:response-time ms',
    }));
  }

  get logger() {
    return this._logger;
  }

  private init() {
    log4js.configure({
      appenders: {
        access: {
          type: 'dateFile',
          filename: '../log/app.log',
          pattern: '-yyyy-MM-dd',
          category: 'http',
        },
        app: {
          type: 'file',
          filename: '../log/app.log',
          maxLogSize: 10485760,
          pattern: '-yyyy-MM-dd',
          numBackups: 3,
        },
        errorFile: {
          type: 'file',
          pattern: '-yyyy-MM-dd',
          filename: '../log/app.log',
        },
        errors: {
          type: 'logLevelFilter',
          level: 'ERROR',
          appender: 'errorFile',
        },
        stdout: {// 控制台输出
          type: 'stdout',
        },
      },
      categories: {
        default: { appenders: ['app', 'errors', 'stdout'], level: 'INFO' },
        http: { appenders: ['access'], level: 'INFO' },
      },
      pm2: true,
    });
  }
}

export const Log = new Log4js();
export default Log.logger;
