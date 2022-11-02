import { discoverElifeArticleSubjectArea } from '../../src/add-article-to-elife-subject-area-list';
import { SubjectArea } from '../../src/types/subject-area';
import { dummyLogger } from '../dummy-logger';
import { arbitraryWord } from '../helpers';
import { arbitraryArticleId } from '../types/article-id.helper';

const arbitrarySubjectArea = (): SubjectArea => ({
  value: arbitraryWord(),
  server: 'biorxiv',
});

describe('discover-elife-article-subject-area', () => {
  describe('when there is work to do', () => {
    describe('when the subject area can be retrieved', () => {
      const articleId = arbitraryArticleId();
      const subjectArea = arbitrarySubjectArea();
      const adapters = {
        recordSubjectArea: jest.fn(),
        logger: dummyLogger,
      };

      it.failing('records the subject area via a command', async () => {
        await discoverElifeArticleSubjectArea(adapters);

        expect(adapters.recordSubjectArea).toHaveBeenCalledWith({ articleId, subjectArea });
      });

      it.todo('invokes only one command');
    });

    describe('when the subject area cannot be retrieved', () => {
      it.todo('does not invoke a command');

      it.todo('logs a warning');
    });
  });

  describe('when there is no work to do', () => {
    it.todo('does not invoke a command');
  });
});
