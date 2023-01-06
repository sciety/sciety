import { StatusCodes } from 'http-status-codes';
import * as tt from 'io-ts-types';
import { Middleware } from 'koa';

export const requireBearerToken = (expectedToken: tt.NonEmptyString): Middleware => async (context, next) => {
  if (context.request.headers.authorization === `Bearer ${expectedToken}`) {
    await next();
  } else {
    context.response.body = 'Unauthorized';
    context.response.status = StatusCodes.FORBIDDEN;
  }
};
