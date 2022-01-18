import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import { getSecretSafely } from './get-secret-safely';

export const requireBearerToken: Middleware = async (context, next) => {
  const expectedToken = getSecretSafely(process.env.SCIETY_TEAM_API_BEARER_TOKEN);
  if (context.request.headers.authorization === `Bearer ${expectedToken}`) {
    await next();
  } else {
    context.response.body = 'Unauthorized';
    context.response.status = StatusCodes.FORBIDDEN;
  }
};
