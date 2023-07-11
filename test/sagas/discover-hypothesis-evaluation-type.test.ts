import * as O from 'fp-ts/Option';
import { discoverHypothesisEvaluationType } from '../../src/sagas/discover-hypothesis-evaluation-type';
import { EvaluationType } from '../../src/types/recorded-evaluation';
import { TestFramework, createTestFramework } from '../framework';
import { arbitraryRecordedEvaluation } from '../types/recorded-evaluation.helper';
import { dummyLogger } from '../dummy-logger';

describe('discover-hypothesis-evaluation-type', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when there is an hypothesis evaluation missing its evaluation type', () => {
    const knownType: EvaluationType = 'review';
    const evaluation = {
      ...arbitraryRecordedEvaluation(),
      type: O.none,
    };
    let result: ReturnType<typeof framework.queries.getEvaluationsForDoi>;

    beforeEach(async () => {
      await framework.commandHelpers.recordEvaluation(evaluation);
      await discoverHypothesisEvaluationType({
        ...framework.queries,
        logger: dummyLogger,
      });
      result = framework.queries.getEvaluationsForDoi(evaluation.articleId);
    });

    it.failing('the evaluation now has a known type', () => {
      expect(result[0]).toStrictEqual(expect.objectContaining({
        type: O.some(knownType),
      }));
    });
  });
});
