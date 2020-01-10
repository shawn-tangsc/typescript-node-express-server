/**
 * [暂时弃用！！]使用了dotenv
 */
import { IEnvConfig } from '@/types/types';
import Logger from './log4js';

class Configs {
  private _option?: string;

  constructor(option?: string) {
    this._option = option;
  }

  public environment(): IEnvConfig {
    switch (this._option) {
      case 'prod':
        return {
          mongodbURL: 'mongodb://localhost/operation',
          nodeUrl: 'http://127.0.0.1:3001',
          secret: 'BETA',
        };
      case 'sit':
        return {
          mongodbURL: 'mongodb://beta:beta@1.1.96.12:31005,1.1.9.13:31005/beta?replicaSet=t3_mongo&readPreference=nearest',
          nodeUrl: 'http://127.0.0.1:3001',
          secret: 'BETA',
        };
      default:
        return {
          mongodbURL: 'mongodb://localhost/beta',
          nodeUrl: 'http://127.0.0.1:3001',
          secret: 'BETA',
        };
    }
  }
}

const _configs = new Configs(process.env.NODE_ENV);
Logger.info('当前环境为：' + process.env.NODE_ENV);
export default _configs;
