import { Middleware } from '@koa/router';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '../infrastructure/logger';

export default (logger: Logger): Middleware => (
  async (_context, next) => {
    const userIdentity = uuidv4();
    logger('debug', 'User identity', { userIdentity });

    await next();
  }
);
