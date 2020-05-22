import { Middleware } from '@koa/router';
import compose from 'koa-compose';

export default (): Middleware => (
  compose([])
);
