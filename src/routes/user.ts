import * as express from 'express';
import { Router } from 'express-serve-static-core';

class User {
  public _router: Router;

  constructor() {
    this._router = express.Router();
    this.setRoutes();
  }

  get router() {
    return this._router;
  }

  public setRoutes(): void {
    this._router.get('/login', (req: any, res: any, next: any) => {
      // res.send({ hello: 'world' });
      console.log('helloworld');
      next(new Error('11111'));
    });
  }
}

export default new User();
