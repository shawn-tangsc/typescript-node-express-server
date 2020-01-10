// import configs from '../config/config';
import Logger from '@/config/log4js';
import mongoose, { Connection } from 'mongoose';

export default class MongooseConfig {
  public static initialize() {
    return new MongooseConfig();
  }

  // private _config: IEnvConfig;
  private connectOption: any = {
    autoReconnect: true,
    keepAlive: true,
    socketTimeoutMS: 3000,
    connectTimeoutMS: 3000,
  };

  constructor() {
    // this._config = (IEnvConfig); process.senv;
    // console.log(process.env.MONOGDB_URL);
  }

  public async start() {
    const uri = process.env.MONOGDB_URL;
    return await this.connectDB()
      .on('connected', () => {
        Logger.info(`mongo ${uri} connect Established`);
      })
      .on('reconnected', () => {
        Logger.info(`mongo connect reestabilished`);
      })
      .on('error', (err) => {
        Logger.error(`connect to  mongodb has some error: ${err}`);
      })
      .on('disconnected', () => {
        Logger.error(` mongodb disconnected`);
        Logger.error(` Trying to reconnect to Mongo...`);
        setTimeout(() => {
          mongoose.connect(process.env.MONOGDB_URL as string, this.connectOption);
        }, 3000);
      })
      .once('open', () => {
        Logger.info(`connect to  ${uri} ...`);
      });
  }

  public connectDB() {
    const uri = process.env.MONOGDB_URL;
    mongoose.connect(uri as string, this.connectOption);
    return mongoose.connection;
  }
}
