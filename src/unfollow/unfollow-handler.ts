import { Middleware } from '@koa/router';
import { Logger } from '../infrastructure/logger';
import EditorialCommunityId from '../types/editorial-community-id';
import FollowList from '../types/follow-list';

type Ports = {
  logger: Logger;
};

const readFollowListFromCookie = (cookieValue: string): Array<string> => {
  try {
    return JSON.parse(cookieValue) as Array<string>;
  } catch {
    return [];
  }
};

export default (ports: Ports): Middleware => (
  async (context, next) => {
    const editorialCommunityId = new EditorialCommunityId(context.request.body.editorialcommunityid);
    const followedEditorialCommunities = readFollowListFromCookie(context.cookies.get('followList') ?? '[]')
      .map((item) => new EditorialCommunityId(item));
    const followList = new FollowList(followedEditorialCommunities);
    followList.unfollow(editorialCommunityId);
    context.cookies.set(
      'followList',
      JSON.stringify(followList.getContents().map((item) => item.value)),
    );

    ports.logger('info', 'User unfollowed editorial community', { editorialCommunityId });

    context.redirect('back');
    await next();
  }
);
