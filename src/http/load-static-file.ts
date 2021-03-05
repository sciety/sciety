import path from 'path';
import { Middleware } from '@koa/router';
import send from 'koa-send';

export const loadStaticFile: Middleware = async (context, next) => {
  const file = context.params.file.replace('editorial-communities', 'groups');
  await send(context, file, { root: path.resolve(__dirname, '../../static') });
  await next();
};
