import bodyParser from 'body-parser';
import cons from 'consolidate';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import 'module-alias/register';
import passport from 'passport';
import path from 'path';
import 'reflect-metadata';
import serveStatic from 'serve-static';
import auth from './auth/Authentication';
import { Log } from './config/log4js';
import { UserController } from './controller/UserController';
import MongooseConfig from './db/mongoose';
import { AuthError, NotFoundError } from './exception';
import { errorHandler } from './exception/ErrorHandler';
import route from './routes';

// tslint:disable-next-line:interface-name
interface Error {
  status?: number;
  message?: string;
}

class App {
  private _app: express.Application;
  get app(): express.Application {
    return this._app;
  }

  constructor() {
    this._app = express();
    this.init();
  }

  private init(): void {
    dotenv.config();
    Log.use(this._app);
    this.setHtmlEngine();
    this.initMiddleware();
    // this.registerRoute();
    // 注意，路由注册一定要放这里，不然会出问题，一定要放这里一定要放这里
    // 为什么呢？因为它的use是有顺序的，你一定要保证error handle是最后一个塞进去的，我虽然真不知道为什么封装到方法里就变了，但是就这样吧
    route.register(this._app);
    this._app.use(this.handle404);
    this._app.use(errorHandler);
    this.initMongoDB();

  }

  private setHtmlEngine(): void {
    this._app.set('views', path.join(__dirname, '../views'));
    this._app.engine('html', cons.swig);
    this._app.set('view engine', 'html');
  }

  private initMiddleware(): void {
    this._app.use(serveStatic(path.resolve(__dirname, './views')));
    this._app.use(bodyParser.json());
    this._app.use(bodyParser.urlencoded({ extended: false }));
    this._app.use(cookieParser());
    this.registerPassport();
    this._app.all('*', this.setResHeader);
    // 注意，注册路由必须在404和error上面，他的逻辑是先use的先进栈，然后请求会在栈中由上到下一个一个看下去。

  }

  private registerPassport() {
    this._app.use(passport.initialize());
    const Auth = new auth();
    Auth.serializeUser();
    Auth.start();

  }

  private registerRoute(): void {
    // 注意，注册路由必须在404和error上面，他的逻辑是先use的先进栈，然后请求会在栈中由上到下一个一个看下去。
    // route.register(this._app);
    // const a = require('./controller/UserController');
    // this._app.use(this.handle404);
    // this._app.get('/', (a, b, c) => {
    //   console.log('1111');
    //   c();
    // });
    this._app.all('*', this.setResHeader);
    // 注意，注册路由必须在404和error上面，他的逻辑是先use的先进栈，然后请求会在栈中由上到下一个一个看下去。
    route.register(this._app);
    this._app.use(this.handle404);
    // this._app.use(this.errorHandler);

  }

  private handle404(req: Request, res: Response, next: NextFunction): void {
    console.log('404');
    const err: Error = new AuthError(`${req.url} Not Found`);
    err.status = 404;
    next(err);
  }

  private initMongoDB(): void {
    new MongooseConfig().start();
  }

  private setResHeader(req: Request, res: Response, next: NextFunction): void {
    res.header('Access-Control-Allow-Origin', req.headers['access-control-allow-origin']);
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With  ,X-Token ,X-HTTP-Method-Override');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method.toLowerCase() === 'OPTIONS') {
      res.send(200);
    } else {
      if (req.method.toLowerCase() === 'delete' || req.method.toLowerCase() === 'put') {
        // 这里可以把delete和put关掉
        // res.send(401);
      }
      // delete和put方法相对不是很安全，所以在这里通过x-http-method-override的方式来修改
      if (req.method.toLowerCase() === 'post') {
        if (req.headers['x-http-method-override'] === 'delete' || req.headers['x-http-method-override'] === 'put') {
          req.method = req.headers['x-http-method-override'];
        }
      }
      next();
    }
  }

  private errorHandler(err: Error, req: Request, res: Response) {
    Log.logger.error(`出错了！：${err}`);
    Log.logger.error(`出错的URL是！：${req.url}`);
    res.locals.message = err.message;
    // res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.locals.error = err;
    Log.logger.error(res.locals.error);
    // render the error page
    res.status(err.status || 500);
    Log.logger.info(req.url);
    if (req.url.match(/.html/)) {
      res.render('error', { error: err.status });
    } else {
      res.send({ err: res.locals.error, msg: res.locals.message });
    }
  }
}

export default new App().app;
