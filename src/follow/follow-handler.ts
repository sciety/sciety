import { Middleware } from '@koa/router';
import { Logger } from '../infrastructure/logger';
import { DomainEvent, UserFollowedEditorialCommunityEvent } from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import FollowList from '../types/follow-list';
import userId from '../types/user-id';

type Ports = {
  logger: Logger;
  commitEvent: (event: DomainEvent) => Promise<void>;
};

export default (ports: Ports): Middleware<{ followList: FollowList }> => (
  async (context, next) => {
    const editorialCommunityId = new EditorialCommunityId(context.request.body.editorialcommunityid);
    const { followList } = context.state;
    followList.follow(editorialCommunityId);
    const event: UserFollowedEditorialCommunityEvent = {
      type: 'UserFollowedEditorialCommunity',
      date: new Date(),
      userId: userId('anonymous'),
      editorialCommunityId,
    };
    await ports.commitEvent(event);

    ports.logger('info', 'User followed editorial community', { editorialCommunityId, event });

    context.redirect('back');

    await next();
  }
);
