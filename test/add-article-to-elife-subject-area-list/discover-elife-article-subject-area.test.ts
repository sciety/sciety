import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { discoverElifeArticleSubjectArea } from '../../src/add-article-to-elife-subject-area-list';
import { dummyLogger } from '../dummy-logger';
import { arbitraryString } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryDataError } from '../types/data-error.helper';
import { arbitrarySubjectArea } from '../types/subject-area.helper';

describe('discover-elife-article-subject-area', () => {
  describe('when there is work to do', () => {
    const articleId = arbitraryArticleId();

    describe('when the subject area can be retrieved', () => {
      const subjectArea = arbitrarySubjectArea();

      describe('and the command is successful', () => {
        const adapters = {
          getArticleSubjectArea: () => TE.right(subjectArea),
          getOneArticleIdInEvaluatedState: () => O.some(articleId),
          recordSubjectArea: jest.fn(() => TE.right(undefined)),
          logger: dummyLogger,
        };

        beforeAll(async () => {
          await discoverElifeArticleSubjectArea(adapters);
        });

        it('records the subject area via a command', () => {
          expect(adapters.recordSubjectArea).toHaveBeenCalledWith({ articleId, subjectArea });
        });
      });

      describe('and the command is not successful', () => {
        const adapters = {
          getArticleSubjectArea: () => TE.right(subjectArea),
          getOneArticleIdInEvaluatedState: () => O.some(articleId),
          recordSubjectArea: jest.fn(() => TE.left(arbitraryString())),
          logger: jest.fn(dummyLogger),
        };

        beforeAll(async () => {
          await discoverElifeArticleSubjectArea(adapters);
        });

        it('logs an error', () => {
          expect(adapters.logger.mock.calls).toStrictEqual(expect.arrayContaining([
            ['error', expect.anything(), expect.anything()],
          ]));
        });
      });
    });

    describe('when the subject area cannot be retrieved', () => {
      const adapters = {
        getArticleSubjectArea: () => TE.left(arbitraryDataError()),
        getOneArticleIdInEvaluatedState: () => O.some(articleId),
        recordSubjectArea: jest.fn(() => TE.right(undefined)),
        logger: jest.fn(dummyLogger),
      };

      beforeAll(async () => {
        await discoverElifeArticleSubjectArea(adapters);
      });

      it('does not invoke a command', () => {
        expect(adapters.recordSubjectArea).not.toHaveBeenCalled();
      });

      it('logs a warning', () => {
        expect(adapters.logger.mock.calls).toStrictEqual(expect.arrayContaining([
          ['warn', expect.anything(), expect.anything()],
        ]));
      });
    });
  });

  describe('when there is no work to do', () => {
    const adapters = {
      getArticleSubjectArea: shouldNotBeCalled,
      getOneArticleIdInEvaluatedState: () => O.none,
      recordSubjectArea: jest.fn(() => TE.right(undefined)),
      logger: dummyLogger,
    };

    beforeAll(async () => {
      await discoverElifeArticleSubjectArea(adapters);
    });

    it('does not invoke a command', () => {
      expect(adapters.recordSubjectArea).not.toHaveBeenCalled();
    });
  });
});
