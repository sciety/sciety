import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../src/domain-events';
import { evaluationRecordedHelper } from '../../types/evaluation-recorded-event.helper';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';
import { handleEvent, initialState } from '../../../src/shared-read-models/evaluations/handle-event';
import { getEvaluationsByGroup } from '../../../src/shared-read-models/evaluations/get-evaluations-by-group';

describe('get-evaluations-by-group', () => {
  const article1 = arbitraryDoi();
  const article2 = arbitraryDoi();
  const group1 = arbitraryGroupId();
  const group2 = arbitraryGroupId();
  const reviewId1 = arbitraryEvaluationLocator();
  const reviewId2 = arbitraryEvaluationLocator();
  const reviewId3 = arbitraryEvaluationLocator();

  describe.each([
    ['two evaluations', group1, [reviewId1, reviewId2]],
    ['one evaluation', group2, [reviewId3]],
    ['no evaluations', arbitraryGroupId(), []],
  ])('when the group has %s', (_, groupId, expectedEvaluations) => {
    const readmodel = pipe(
      [
        evaluationRecordedHelper(group1, article1, reviewId1, [], new Date(), new Date('2020-05-19T00:00:00Z')),
        evaluationRecordedHelper(group1, article2, reviewId2, [], new Date(), new Date('2020-05-21T00:00:00Z')),
        evaluationRecordedHelper(group2, article1, reviewId3, [], new Date(), new Date('2020-05-20T00:00:00Z')),
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const actualEvaluations = pipe(
      groupId,
      getEvaluationsByGroup(readmodel),
      RA.map((evaluation) => evaluation.evaluationLocator),
    );

    it('finds the correct evaluations', () => {
      expect(actualEvaluations).toStrictEqual(expectedEvaluations);
    });
  });

  it('does not return erased evaluations', () => {
    const readmodel = pipe(
      [
        evaluationRecordedHelper(group1, article1, reviewId1, [], new Date(), new Date('2020-05-19T00:00:00Z')),
        evaluationRecordedHelper(group1, article2, reviewId2, [], new Date(), new Date('2020-05-21T00:00:00Z')),
        constructEvent('IncorrectlyRecordedEvaluationErased')({ evaluationLocator: reviewId1 }),
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const actualEvaluations = pipe(
      group1,
      getEvaluationsByGroup(readmodel),
      RA.map((evaluation) => evaluation.evaluationLocator),
    );

    expect(actualEvaluations).toStrictEqual([reviewId2]);
  });

  describe('when the evaluation is a curation statement', () => {
    const readmodel = pipe(
      [
        evaluationRecordedHelper(group1, article1, reviewId1, [], new Date(), new Date('2020-05-19T00:00:00Z')),
        constructEvent('CurationStatementRecorded')({
          articleId: article1,
          groupId: group1,
          evaluationLocator: reviewId1,
        }),
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const result = pipe(
      group1,
      getEvaluationsByGroup(readmodel),
    );

    it('sets the type correctly', () => {
      expect(result[0].type).toStrictEqual(O.some('curation-statement'));
    });
  });
});
