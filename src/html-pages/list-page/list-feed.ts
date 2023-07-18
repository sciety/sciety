import { Middleware } from '@koa/router';
import { HttpStatusCode } from 'axios';
import { renderAsAtom } from './render-as-atom';

export const listFeed: Middleware = async (context, next) => {
  context.response.status = HttpStatusCode.Ok;
  context.response.type = 'application/atom+xml';
  context.response.body = renderAsAtom();

  await next();
};
