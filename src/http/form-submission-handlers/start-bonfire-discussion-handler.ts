import { Middleware } from 'koa';
import { Logger } from '../../logger';

type Dependencies = {
  logger: Logger,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const startBonfireDiscussionHandler = (dependencies: Dependencies): Middleware => async (context) => {};
