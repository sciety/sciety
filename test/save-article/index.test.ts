import { RouterContext } from '@koa/router';
import { saveArticleHandler } from '../../src/save-article';
import Doi from '../../src/types/doi';
import { User } from '../../src/types/user';
import toUserId from '../../src/types/user-id';

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

      const commitEvents = jest.fn();

      await saveArticleHandler({ commitEvents })(context, jest.fn());

      expect(commitEvents).toHaveBeenCalledWith([expect.objectContaining({
        type: 'UserSavedArticle',
        userId,
        articleId,
      })]);
    });
  });

  describe('when the user has already saved the article', () => {
    it.todo('does nothing');
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

    await saveArticleHandler({ commitEvents: jest.fn() })(context, jest.fn());

    expect(context.redirect).toHaveBeenCalledWith('back');
  });
});
