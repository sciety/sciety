import { Middleware } from '@koa/router';
import { Logger } from '../infrastructure/logger';
import EditorialCommunityId from '../types/editorial-community-id';

type Ports = {
  logger: Logger;
};

export default (ports: Ports): Middleware => (
  async (context, next) => {
    const editorialCommunityId = new EditorialCommunityId(context.request.body.editorialcommunityid);
    ports.logger('info', 'User followed editorial community', { editorialCommunityId });

    context.redirect('/');
    await next();
  }
);
