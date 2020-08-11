import { Middleware, RouterContext } from '@koa/router';
import { Next } from 'koa';
import EditorialCommunityId from '../types/editorial-community-id';
import FollowList from '../types/follow-list';

const readFollowListFromCookie = (cookieValue: string): Array<string> => {
  try {
    return JSON.parse(cookieValue) as Array<string>;
  } catch {
    return [];
  }
};

export default (): Middleware => (
  async (context: RouterContext, next: Next): Promise<void> => {
    const followedEditorialCommunities = readFollowListFromCookie(context.cookies.get('followList') ?? '[]')
      .map((item) => new EditorialCommunityId(item));
    const followList = new FollowList(followedEditorialCommunities);
    context.state.followList = followList;
    await next();
  }
);
