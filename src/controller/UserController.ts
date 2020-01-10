import { AuthError } from '@/exception';
import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import NodeRSA from 'node-rsa';
import path from 'path';

import { IUser, User } from '@/db/mongoModel/models/User';
import { Auth, CController, Get, Post } from '@/decorators';
import BaseController from './BaseController';

@CController('/user')
export class UserController extends BaseController {
  constructor() {
    super();
  }

  @Auth()
  @Get('/info')
  public async info(req: Request, res: Response, next: NextFunction) {
    console.log('info');
    const data = {
      userName: req.user.userName,
      roles: req.user.get('roles'),
    };
    res.send({ data });
  }

  @Post('/login')
  public async login(req: Request, res: Response, next: NextFunction) {
    const data = req.body;
    if (data.username && data.password) {
      try {
        const prikey = fs.readFileSync(path.resolve(__dirname, '../../pem/private_1024.pem'));
        const key = new NodeRSA(prikey);
        // key.setOptions({ encryptionScheme: 'pkcs1' });
        const passwordDec = key.decrypt(data.password, 'utf8');
        const user: IUser = await User.findOne({ userName: data.username });
        if (!user) {
          throw new AuthError('认证失败，用户不存在!');
          // res.status(401).send({ code: 'C100001', message: '认证失败，用户不存在!' });
        } else {
          const isMatch = User.comparePassword(passwordDec, user.password);
          if (isMatch) {
            // jwt 中文文档 https://segmentfault.com/a/1190000009494020
            const token = jwt.sign({
              username: user.userName,
              exp: Math.floor(Date.now() / 1000) + (60 * 60 * 12),
            }, process.env.JWT_SECRET as string, { algorithm: 'HS512' });
            // 这里是让前端可以获取Authorization 请求头
            res.setHeader('Access-Control-Expose-Headers', 'Authorization');
            res.setHeader('Authorization', 'Bearer ' + token);
            return res.send({
              code: 'APP0000',
              message: '登陆成功',
              data: {
                token: 'Bearer ' + token,
              },
            });
          } else {
            // const err = new Error('密码错误');
            // this.logger.error(err);
            // res.status(401).send({ code: 'APP0011', message: '账号密码不正确!' });
            throw new AuthError('账号密码不正确!');
          }
        }
      } catch (e) {
        // throw e;
        // console.log(next);
        // e = new Error('账号密码不正确!');
        next(e);
        // res.status(401).send({ code: 'APP0011', message: '账号密码不正确!' });
      }
    } else {
      const err = new AuthError('账号密码不正确!');
      next(err);
      // res.status(401).send({ code: 'APP0011', message: '账号密码不正确!' });
    }

  }
}
