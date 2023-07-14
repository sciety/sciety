import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { URL } from 'url';
import { discoverHypothesisEvaluationType } from '../../../src/sagas/discover-hypothesis-evaluation-type';
import { EvaluationType } from '../../../src/types/recorded-evaluation';
import { TestFramework, createTestFramework } from '../../framework';
import { arbitraryRecordedEvaluation } from '../../types/recorded-evaluation.helper';
import { dummyLogger } from '../../dummy-logger';
import { arbitrarySanitisedHtmlFragment, arbitraryUri } from '../../helpers';
import { EvaluationLocator } from '../../../src/types/evaluation-locator';

describe('discover-hypothesis-evaluation-type', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when there is an hypothesis evaluation missing its evaluation type', () => {
    const knownType: EvaluationType = 'review';
    const evaluation = {
      ...arbitraryRecordedEvaluation(),
      evaluationLocator: 'hypothesis:abc' as EvaluationLocator,
      type: O.none,
    };
    let result: ReturnType<typeof framework.queries.getEvaluationsForDoi>;

    beforeEach(async () => {
      await framework.commandHelpers.recordEvaluation(evaluation);
      await discoverHypothesisEvaluationType({
        ...framework.queries,
        commitEvents: framework.commitEvents,
        getAllEvents: framework.getAllEvents,
        fetchReview: () => TE.right({
          fullText: arbitrarySanitisedHtmlFragment(),
          url: new URL(arbitraryUri()),
          tags: ['peerReview'],
        }),
        logger: dummyLogger,
      });
      result = framework.queries.getEvaluationsForDoi(evaluation.articleId);
    });

    describe('and the evaluation can be fetched from hypothes.is', () => {
      it('the evaluation now has a known type', () => {
        expect(result[0]).toStrictEqual(expect.objectContaining({
          type: O.some(knownType),
        }));
      });
    });

    describe('but hypothes.is is unavalable', () => {
      it.todo('does nothing');
    });

    describe('but the evaluation is no longer on hypothes.is', () => {
      it.todo('marks the evaluation type as not-provided');
    });
  });
});
