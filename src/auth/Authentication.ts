// import config from '../config/config';
import logger from '@/config/log4js';
import { IUser, User } from '@/db/mongoModel/models/User';
import { AuthError, NotFoundError } from '@/exception';
import { IDecoded, IHttpError } from '@/types/types';
import jwt from 'jsonwebtoken';
import passport, { Strategy } from 'passport';
import BearerStrategy, { IVerifyOptions } from 'passport-http-bearer';
// const ENV_CONFIG = config.environment();

export default class Authentication {
  private _strategy = BearerStrategy.Strategy;
  // constructor(passport: passport.Authenticator) {

  // }
  public serializeUser() {
    passport.serializeUser((user: any, done) => {
      done(null, user.id);
    });

    passport.deserializeUser(async (id: number, done) => {
      const user: IUser = await User.findById(id.toString());
      done(null, user);
    });
  }

  public start() {
    // console.log
    passport.use(this.getStrategy());
  }

  private getStrategy(): Strategy {
    return new this._strategy(this.verifyJWT);
  }

  private verifyJWT(token: string, done: (error: any, user?: any, options?: IVerifyOptions | string) => void) {
    console.log('helloworld');
    jwt.verify(token, process.env.JWT_SECRET as string, { algorithms: ['HS512'] }, async (err: any, decoded: string | object) => {
      if (err) {
        logger.error(err);
        err = new AuthError('No user found with provided token');
        return done(err, false, { message: 'token 已经过期', scope: 'null' });
      } else {
        // 如果没问题就把解码后的信息保存到请求中，供后面的路由使用
        // const result: IDecoded = typeof decoded === Object ? decoded : '';
        if ((decoded as IDecoded).exp * 1000 > new Date().getTime()) {
          try {
            const user = await User.findOne({ userName: (decoded as IDecoded).username });
            err = new AuthError('No user found with provided token');
            if (!user) {
              return done(err, false, { message: '用户不存在', scope: 'scope' });
            }
            return done(null, user);
          } catch (error) {
            logger.error(err);
            return done(err);
          }
        } else {
          err = new AuthError('No user found with provided token');
          logger.error(err);
          return done(err, false, 'token 失效，请重新登陆');
        }
      }
    });
  }
}
