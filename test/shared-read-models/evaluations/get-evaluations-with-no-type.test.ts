import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { evaluationRecordedHelper } from '../../types/evaluation-recorded-event.helper';
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
        evaluationRecordedHelper(
          evaluation1.groupId,
          evaluation1.articleId,
          evaluation1.evaluationLocator,
          evaluation1.authors,
          evaluation1.publishedAt,
          evaluation1.recordedAt,
          'author-response',
        ),
        evaluationRecordedHelper(
          evaluation2.groupId,
          evaluation2.articleId,
          evaluation2.evaluationLocator,
          evaluation2.authors,
          evaluation2.publishedAt,
          evaluation2.recordedAt,
          undefined,
        ),
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const result = getEvaluationsWithNoType(readModel)();

    it('returns only the evaluations with no type', () => {
      expect(result).toStrictEqual([evaluation2]);
    });
  });
});
