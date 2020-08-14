import { Middleware, RouterContext } from '@koa/router';
import { Next } from 'koa';
import EditorialCommunityId from '../types/editorial-community-id';
import FollowList from '../types/follow-list';

const OneYear = 1000 * 60 * 60 * 24 * 365;

const readFollowListFromCookie = (cookieValue: string): Array<string> => {
  try {
    return JSON.parse(cookieValue) as Array<string>;
  } catch {
    return [];
  }
};

export default (): Middleware => (
  async (context: RouterContext, next: Next): Promise<void> => {
    const cookieText = context.cookies.get('hiveFollowList');
    const hadCookie = (!!cookieText);
    const followedEditorialCommunities = readFollowListFromCookie(cookieText ?? '[]')
      .map((item) => new EditorialCommunityId(item));
    const followList = new FollowList(followedEditorialCommunities);
    context.state.followList = followList;

    await next();

    if (!hadCookie || followList.changed) {
      const cookieContents = JSON.stringify(followList.getContents().map((item) => item.value));
      context.cookies.set('hiveFollowList', cookieContents, {
        maxAge: OneYear,
        sameSite: 'strict',
      });
    }
  }
);
