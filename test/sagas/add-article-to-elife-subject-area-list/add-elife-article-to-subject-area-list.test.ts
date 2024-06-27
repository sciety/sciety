import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { addArticleToElifeSubjectAreaList } from '../../../src/sagas/add-article-to-elife-subject-area-list/add-article-to-elife-subject-area-list';
import { ArticleId } from '../../../src/types/article-id';
import { dummyLogger } from '../../dummy-logger';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import { arbitraryListId } from '../../types/list-id.helper';

describe('add-elife-article-to-subject-area-list', () => {
  describe('when there is work to do', () => {
    const articleId = arbitraryExpressionDoi();
    const listId = arbitraryListId();
    const adapters = {
      addArticleToList: jest.fn(() => TE.right('events-created' as const)),
      getOneArticleReadyToBeListed: () => O.some({
        articleId: new ArticleId(articleId),
        listId,
      }),
      logger: dummyLogger,
    };

    beforeAll(async () => {
      await addArticleToElifeSubjectAreaList(adapters);
    });

    it('invokes addArticleToList command', () => {
      expect(adapters.addArticleToList).toHaveBeenCalledWith({
        articleId,
        listId,
      });
    });
  });

  describe('when there is no work to do', () => {
    const adapters = {
      addArticleToList: jest.fn(),
      getOneArticleReadyToBeListed: () => O.none,
      logger: dummyLogger,
    };

    beforeAll(async () => {
      await addArticleToElifeSubjectAreaList(adapters);
    });

    it('does not invoke a command', () => {
      expect(adapters.addArticleToList).not.toHaveBeenCalled();
    });
  });
});
