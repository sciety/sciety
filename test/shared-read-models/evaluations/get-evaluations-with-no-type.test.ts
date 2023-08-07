import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { arbitraryEvaluationRecordedEvent } from '../../domain-events/evaluation-publication-recorded-event.helper';
import { handleEvent, initialState } from '../../../src/shared-read-models/evaluations/handle-event';
import { arbitraryRecordedEvaluation } from '../../types/recorded-evaluation.helper';
import { getEvaluationsWithNoType } from '../../../src/shared-read-models/evaluations/get-evaluations-with-no-type';

describe('get-evaluations-with-no-type', () => {
  describe('when some evaluations have no type', () => {
    const evaluation1 = arbitraryRecordedEvaluation();
    const evaluation2 = {
      ...arbitraryRecordedEvaluation(),
      type: O.none,
    };
    const readModel = pipe(
      [
        {
          ...arbitraryEvaluationRecordedEvent(),
          groupId: evaluation1.groupId,
          articleId: evaluation1.articleId,
          evaluationLocator: evaluation1.evaluationLocator,
          authors: evaluation1.authors,
          publishedAt: evaluation1.publishedAt,
          date: evaluation1.recordedAt,
          evaluationType: 'author-response',
        },
        {
          ...arbitraryEvaluationRecordedEvent(),
          groupId: evaluation2.groupId,
          articleId: evaluation2.articleId,
          evaluationLocator: evaluation2.evaluationLocator,
          authors: evaluation2.authors,
          publishedAt: evaluation2.publishedAt,
          date: evaluation2.recordedAt,
          evaluationType: undefined,
        },
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const result = getEvaluationsWithNoType(readModel)();

    it('returns only the evaluations with no type', () => {
      expect(result).toStrictEqual([evaluation2]);
    });
  });
});
