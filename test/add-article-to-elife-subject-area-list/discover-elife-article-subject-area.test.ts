import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { discoverElifeArticleSubjectArea } from '../../src/add-article-to-elife-subject-area-list';
import { SubjectArea } from '../../src/types/subject-area';
import { dummyLogger } from '../dummy-logger';
import { arbitraryWord } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryDataError } from '../types/data-error.helper';

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
        getArticleSubjectArea: () => TE.right(subjectArea),
        getOneArticleIdInEvaluatedState: () => O.some(articleId),
        recordSubjectArea: jest.fn(() => TE.right(undefined)),
        logger: dummyLogger,
      };

      it('records the subject area via a command', async () => {
        await discoverElifeArticleSubjectArea(adapters);

        expect(adapters.recordSubjectArea).toHaveBeenCalledWith({ articleId, subjectArea });
      });
    });

    describe('when the subject area cannot be retrieved', () => {
      const articleId = arbitraryArticleId();
      const adapters = {
        getArticleSubjectArea: () => TE.left(arbitraryDataError()),
        getOneArticleIdInEvaluatedState: () => O.some(articleId),
        recordSubjectArea: jest.fn(() => TE.right(undefined)),
        logger: dummyLogger,
      };

      it('does not invoke a command', async () => {
        await discoverElifeArticleSubjectArea(adapters);

        expect(adapters.recordSubjectArea).not.toHaveBeenCalled();
      });

      it.todo('logs a warning');
    });
  });

  describe('when there is no work to do', () => {
    const adapters = {
      getArticleSubjectArea: shouldNotBeCalled,
      getOneArticleIdInEvaluatedState: () => O.none,
      recordSubjectArea: jest.fn(() => TE.right(undefined)),
      logger: dummyLogger,
    };

    it('does not invoke a command', async () => {
      await discoverElifeArticleSubjectArea(adapters);

      expect(adapters.recordSubjectArea).not.toHaveBeenCalled();
    });
  });
});
