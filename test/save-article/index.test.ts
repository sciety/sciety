import { RouterContext } from '@koa/router';
import * as T from 'fp-ts/lib/Task';
import { saveArticleHandler } from '../../src/save-article';
import Doi from '../../src/types/doi';
import { userSavedArticle } from '../../src/types/domain-events';
import { User } from '../../src/types/user';
import { toUserId } from '../../src/types/user-id';

describe('save-article', () => {
  describe('when the user has not already saved the article', () => {
    it('commits a UserSavedArticle event', async () => {
      const userId = toUserId('user-id');
      const articleId = new Doi('10.1234/5678');
      const context = ({
        request: {
          body: {
            articleid: articleId.value,
          },
        },
        redirect: jest.fn(),
        state: {
          user: {
            id: userId,
          },
        },
      } as unknown) as RouterContext<{ user: User }>;

      const getAllEvents = T.of([]);
      const commitEvents = jest.fn().mockImplementation(() => T.of(undefined));

      await saveArticleHandler({ getAllEvents, commitEvents })(context, jest.fn());

      expect(commitEvents).toHaveBeenCalledWith([expect.objectContaining({
        type: 'UserSavedArticle',
        userId,
        articleId,
      })]);
    });
  });

  describe('when the user has already saved the article', () => {
    it('does nothing', async () => {
      const userId = toUserId('user-id');
      const articleId = new Doi('10.1234/5678');
      const context = ({
        request: {
          body: {
            articleid: articleId.value,
          },
        },
        redirect: jest.fn(),
        state: {
          user: {
            id: userId,
          },
        },
      } as unknown) as RouterContext<{ user: User }>;

      const getAllEvents = T.of([
        userSavedArticle(userId, articleId),
      ]);
      const commitEvents = jest.fn().mockImplementation(() => T.of(undefined));

      await saveArticleHandler({ getAllEvents, commitEvents })(context, jest.fn());

      expect(commitEvents).toHaveBeenCalledWith([]);
    });
  });

  it('redirects back', async () => {
    const context = ({
      request: {
        body: {
          articleid: new Doi('10.1234/5678').value,
        },
      },
      redirect: jest.fn(),
      state: {
        user: {
          id: toUserId('user-id'),
        },
      },
    } as unknown) as RouterContext<{ user: User }>;

    const getAllEvents = T.of([]);
    await saveArticleHandler({ getAllEvents, commitEvents: () => T.of(undefined) })(context, jest.fn());

    expect(context.redirect).toHaveBeenCalledWith('back');
  });
});
