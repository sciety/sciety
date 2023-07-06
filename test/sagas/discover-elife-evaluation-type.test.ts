import * as O from 'fp-ts/Option';
import { EvaluationType } from '../../src/types/recorded-evaluation';
import { TestFramework, createTestFramework } from '../framework';
import { arbitraryRecordedEvaluation } from '../types/recorded-evaluation.helper';

describe('discover-elife-evaluation-type', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when there is an eLife evaluation missing its evaluation type', () => {
    const knownType: EvaluationType = 'review';
    const evaluation = arbitraryRecordedEvaluation();
    let result: ReturnType<typeof framework.queries.getEvaluationsForDoi>;

    beforeEach(async () => {
      await framework.commandHelpers.recordEvaluation(evaluation);
      result = framework.queries.getEvaluationsForDoi(evaluation.articleId);
    });

    it.failing('the evaluation now has a known type', () => {
      expect(result[0]).toStrictEqual(expect.objectContaining({
        evaluationType: O.some(knownType),
      }));
    });
  });
});
