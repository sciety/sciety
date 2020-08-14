import { Middleware } from '@koa/router';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '../infrastructure/logger';

const OneYear = 1000 * 60 * 60 * 24 * 365;

export default (logger: Logger): Middleware => (
  async (context, next) => {
    let userIdentity = context.cookies.get('hiveSession');

    if (!userIdentity) {
      userIdentity = uuidv4();
      context.cookies.set('hiveSession', userIdentity, {
        maxAge: OneYear,
        sameSite: 'strict',
      });
    }

    logger('debug', 'User identity', { userIdentity });
    await next();
  }
);
