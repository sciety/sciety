import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { dummyLogger } from '../../dummy-logger';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryDataError } from '../../types/data-error.helper';
import { arbitrarySubjectArea } from '../../types/subject-area.helper';
import { Ports, discoverElifeArticleSubjectArea } from '../../../src/sagas/discover-elife-article-subject-area/discover-elife-article-subject-area';
import { TestFramework, createTestFramework } from '../../framework';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import { ArticleId } from '../../../src/types/article-id';

describe('discover-elife-article-subject-area', () => {
  let framework: TestFramework;
  let adapters: Ports;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when there is work to do', () => {
    const expressionDoi = arbitraryExpressionDoi();

    describe('when the subject area can be retrieved', () => {
      const subjectArea = arbitrarySubjectArea();

      describe('and the command is successful', () => {
        beforeEach(async () => {
          adapters = {
            ...framework.happyPathThirdParties,
            getArticleSubjectArea: () => TE.right(subjectArea),
            getOneArticleIdInEvaluatedState: () => O.some(expressionDoi),
            recordSubjectArea: jest.fn(() => TE.right('events-created' as const)),
            logger: dummyLogger,
          };
          await discoverElifeArticleSubjectArea(adapters);
        });

        it('records the subject area via a command', () => {
          expect(adapters.recordSubjectArea).toHaveBeenCalledWith({
            articleId: new ArticleId(expressionDoi),
            subjectArea,
          });
        });
      });
    });

    describe('when the subject area cannot be retrieved', () => {
      beforeEach(async () => {
        adapters = {
          ...framework.happyPathThirdParties,
          getArticleSubjectArea: () => TE.left(arbitraryDataError()),
          getOneArticleIdInEvaluatedState: () => O.some(expressionDoi),
          recordSubjectArea: jest.fn(() => TE.right('no-events-created' as const)),
          logger: dummyLogger,
        };
        await discoverElifeArticleSubjectArea(adapters);
      });

      it('does not invoke a command', () => {
        expect(adapters.recordSubjectArea).not.toHaveBeenCalled();
      });
    });
  });

  describe('when there is no work to do', () => {
    beforeEach(async () => {
      adapters = {
        ...framework.happyPathThirdParties,
        getArticleSubjectArea: shouldNotBeCalled,
        getOneArticleIdInEvaluatedState: () => O.none,
        recordSubjectArea: jest.fn(() => TE.right('no-events-created' as const)),
        logger: dummyLogger,
      };
      await discoverElifeArticleSubjectArea(adapters);
    });

    it('does not invoke a command', () => {
      expect(adapters.recordSubjectArea).not.toHaveBeenCalled();
    });
  });
});
