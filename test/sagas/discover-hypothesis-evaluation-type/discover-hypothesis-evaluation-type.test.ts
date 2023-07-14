import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { URL } from 'url';
import * as DE from '../../../src/types/data-error';
import { discoverHypothesisEvaluationType } from '../../../src/sagas/discover-hypothesis-evaluation-type';
import { TestFramework, createTestFramework } from '../../framework';
import { arbitraryRecordedEvaluation } from '../../types/recorded-evaluation.helper';
import { dummyLogger } from '../../dummy-logger';
import { arbitrarySanitisedHtmlFragment, arbitraryUri } from '../../helpers';
import { EvaluationLocator } from '../../../src/types/evaluation-locator';

describe('discover-hypothesis-evaluation-type', () => {
  let framework: TestFramework;
  let defaultDependencies: Omit<Parameters<typeof discoverHypothesisEvaluationType>[0], 'fetchReview'>;

  beforeEach(() => {
    framework = createTestFramework();
    defaultDependencies = {
      ...framework.queries,
      commitEvents: framework.commitEvents,
      getAllEvents: framework.getAllEvents,
      logger: dummyLogger,
    };
  });

  describe('when there is an hypothesis evaluation missing its evaluation type', () => {
    const evaluation = {
      ...arbitraryRecordedEvaluation(),
      evaluationLocator: 'hypothesis:abc' as EvaluationLocator,
      type: O.none,
    };

    beforeEach(async () => {
      await framework.commandHelpers.recordEvaluation(evaluation);
    });

    describe('and the evaluation can be fetched from hypothes.is', () => {
      beforeEach(async () => {
        await discoverHypothesisEvaluationType({
          ...defaultDependencies,
          fetchReview: () => TE.right({
            fullText: arbitrarySanitisedHtmlFragment(),
            url: new URL(arbitraryUri()),
            tags: ['peerReview'],
          }),
        });
      });

      it('the evaluation now has a known type', () => {
        const result = framework.queries.getEvaluationsForDoi(evaluation.articleId);

        expect(result[0]).toStrictEqual(expect.objectContaining({
          type: O.some('review'),
        }));
      });
    });

    describe('but hypothes.is is unavalable', () => {
      beforeEach(async () => {
        await discoverHypothesisEvaluationType({
          ...defaultDependencies,
          fetchReview: () => TE.left(DE.unavailable),
        });
      });

      it.todo('does nothing');
    });

    describe('but the evaluation is no longer on hypothes.is', () => {
      beforeEach(async () => {
        await discoverHypothesisEvaluationType({
          ...defaultDependencies,
          fetchReview: () => TE.left(DE.notFound),
        });
      });

      it.todo('marks the evaluation type as not-provided');
    });
  });
});
