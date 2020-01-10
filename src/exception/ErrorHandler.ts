import { NextFunction, Request, Response } from 'express';
import logger from '../config/log4js';
import { AuthError } from './errors/AuthError';
import { BaseError } from './errors/BaseError';
import { DatabaseError } from './errors/DatabaseError';
import { InternalServerError } from './errors/InternalServerError';
import { NotFoundError } from './errors/NotFoundError';
import { RegistrationError } from './errors/RegistrationError';

export function errorHandler(error: any, req: any, res: any, next: any) {
  logger.error(`出错的URL是!！：${req.url}`);
  if (error instanceof RegistrationError) {
    logger.error(error);
    return res.status(400).json(error);
  }
  if (error instanceof AuthError) {
    logger.error(error);
    return res.status(401).json(error);
  }
  if (error.name === 'AuthenticationError') {
    logger.error(error.message);
    return res.status(403).json(error);
  }
  if (error instanceof DatabaseError) {
    logger.error(error);
    return res.status(500).json(error);
  }
  if (error instanceof NotFoundError) {
    logger.error(error);
    return res.status(404).json(error);
  }
  logger.error(error.message);
  if (req.url.match(/.html/)) {
    return res.render('error', { error: 123 });
  } else {
    return res.status(500).json(new InternalServerError(error.message));
  }

}
