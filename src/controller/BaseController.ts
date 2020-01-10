import configs from '@/config/config';
import log4js from '@/config/log4js';
import { IEnvConfig } from '@/types/types';

export default class BaseController {
  public logger = log4js;
  public config: IEnvConfig;

  constructor() {
    this.config = configs.environment();
  }
}
