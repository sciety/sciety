import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { dummyLogger } from '../../dummy-logger.js';
import { shouldNotBeCalled } from '../../should-not-be-called.js';
import { arbitraryArticleId } from '../../types/article-id.helper.js';
import { arbitraryDataError } from '../../types/data-error.helper.js';
import { arbitraryErrorMessage } from '../../types/error-message.helper.js';
import { arbitrarySubjectArea } from '../../types/subject-area.helper.js';
import { discoverElifeArticleSubjectArea } from '../../../src/sagas/discover-elife-article-subject-area/discover-elife-article-subject-area.js';

describe('discover-elife-article-subject-area', () => {
  describe('when there is work to do', () => {
    const articleId = arbitraryArticleId();

    describe('when the subject area can be retrieved', () => {
      const subjectArea = arbitrarySubjectArea();

      describe('and the command is successful', () => {
        const adapters = {
          getArticleSubjectArea: () => TE.right(subjectArea),
          getOneArticleIdInEvaluatedState: () => O.some(articleId),
          recordSubjectArea: jest.fn(() => TE.right('events-created' as const)),
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
          recordSubjectArea: jest.fn(() => TE.left(arbitraryErrorMessage())),
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
        recordSubjectArea: jest.fn(() => TE.right('no-events-created' as const)),
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
      recordSubjectArea: jest.fn(() => TE.right('no-events-created' as const)),
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
