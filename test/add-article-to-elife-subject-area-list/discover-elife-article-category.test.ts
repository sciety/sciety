import { discoverElifeArticleCategory } from '../../src/add-article-to-elife-subject-area-list';
import { dummyLogger } from '../dummy-logger';
import { arbitraryWord } from '../helpers';
import { arbitraryArticleId } from '../types/article-id.helper';

describe('discover-elife-article-category', () => {
  describe('when there is work to do', () => {
    describe('when the category can be retrieved', () => {
      const articleId = arbitraryArticleId();
      const category = arbitraryWord();
      const adapters = {
        recordBiorxivCategory: jest.fn(),
        logger: dummyLogger,
      };

      it.failing('records the category via a command', async () => {
        await discoverElifeArticleCategory(adapters);

        expect(adapters.recordBiorxivCategory).toHaveBeenCalledWith({ articleId, category });
      });

      it.todo('invokes only one command');
    });

    describe('when the category cannot be retrieved', () => {
      it.todo('does not invoke a command');

      it.todo('logs a warning');
    });
  });

  describe('when there is no work to do', () => {
    it.todo('does not invoke a command');
  });
});
