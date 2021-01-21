import * as T from 'fp-ts/lib/Task';
import { ParameterizedContext } from 'koa';
import { finishSaveArticleCommand } from '../../src/save-article/finish-save-article-command';
import { Doi } from '../../src/types/doi';
import { toUserId } from '../../src/types/user-id';

describe('finish-save-article-command', () => {
  describe('after saving', () => {
    it('deletes session parameters', async () => {
      const userId = toUserId('user-id');
      const articleId = new Doi('10.1234/5678');
      const context = ({
        session: {
          command: 'save-article',
          articleId: articleId.value,
        },
        state: {
          user: {
            id: userId,
          },
        },
      } as unknown) as ParameterizedContext;

      await finishSaveArticleCommand({
        commitEvents: () => T.of(undefined),
        getAllEvents: async () => [],
      })(context, jest.fn());

      expect(context.session).toStrictEqual({});
    });
  });
});
