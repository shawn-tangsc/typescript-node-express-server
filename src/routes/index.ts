import { IRouteDefinition } from '@/types/types';
import { NextFunction, Response } from 'express';
import * as express from 'express';
import passport from 'passport';
import * as Controllers from '../controller';
import { errorHandler } from '../exception/ErrorHandler';
import user from './user';
export default class Routes {
  public static register(app: express.Application) {
    // app.use('/user', user.router);
    Object.keys(Controllers).forEach((key) => {
      const controller = (Controllers as any)[key];
      const instance = new controller();
      const prefix = Reflect.getMetadata('prefix', controller);
      const routes: IRouteDefinition[] = Reflect.getMetadata('routes', controller);
      const R = express.Router();
      routes.forEach(route => {
        // It would be a good idea at this point substitute the `app[route.requestMethod]` with a `switch/case` statement
        // since we can't be sure about the availability of methods on our `app` object. But for the sake of simplicity
        // this should be enough for now.
        const auth: boolean = !!Reflect.getMetadata('auth', route.target, route.methodName);
        if (auth) {
          R[route.requestMethod](route.path, passport.authenticate('bearer', { session: false }), instance[route.methodName]);
        } else {
          R[route.requestMethod](route.path, instance[route.methodName]);
        }

      });
      app.use(prefix, R);
    });

  }

}
