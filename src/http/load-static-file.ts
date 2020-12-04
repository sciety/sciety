import path from 'path';
import { Middleware } from '@koa/router';
import send from 'koa-send';

export const loadStaticFile: Middleware = async (context, next) => {
  await send(context, context.params.file, { root: path.resolve(__dirname, '../../static') });
  await next();
};
