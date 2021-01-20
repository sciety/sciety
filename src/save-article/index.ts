import { Middleware } from '@koa/router';
import Doi from '../types/doi';
import { userSavedArticle, UserSavedArticleEvent } from '../types/domain-events';
import { User } from '../types/user';

type Ports = {
  commitEvents: (events: ReadonlyArray<UserSavedArticleEvent>) => Promise<void>,
};

export const saveArticleHandler = (ports: Ports): Middleware<{ user: User }> => async (context, next) => {
  const user = context.state.user as User;
  const articleId = new Doi(context.request.body.articleid);
  await ports.commitEvents([
    userSavedArticle(user.id, articleId),
  ]);
  context.redirect('back');

  await next();
};
