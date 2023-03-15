import * as E from 'fp-ts/Either';
import { arbitraryArticleId } from '../../../types/article-id.helper';

describe('construct-view-model', () => {
  describe('when a user saves an article that is not in any list', () => {
    it.skip('the article details are included in the page content', () => {
      const viewmodel = { contentViewModel: undefined };
      const articleId = arbitraryArticleId();

      expect(viewmodel.contentViewModel).toStrictEqual(expect.objectContaining({
        articles: [
          E.right(expect.objectContaining({
            articleViewModel: expect.objectContaining({
              articleId,
            }),
          })),
        ],
      }));
    });
  });
});
