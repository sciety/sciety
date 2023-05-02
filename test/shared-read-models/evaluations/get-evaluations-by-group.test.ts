import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { evaluationRecorded, incorrectlyRecordedEvaluationErased } from '../../../src/domain-events';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';
import { handleEvent, initialState } from '../../../src/shared-read-models/evaluations';
import { getEvaluationsByGroup } from '../../../src/shared-read-models/evaluations/get-evaluations-by-group';

describe('get-evaluations-by-group', () => {
  const article1 = arbitraryDoi();
  const article2 = arbitraryDoi();
  const group1 = arbitraryGroupId();
  const group2 = arbitraryGroupId();
  const reviewId1 = arbitraryReviewId();
  const reviewId2 = arbitraryReviewId();
  const reviewId3 = arbitraryReviewId();

  it.each([
    ['two evaluations', group1, [reviewId1, reviewId2]],
    ['one evaluation', group2, [reviewId3]],
    ['no evaluations', arbitraryGroupId(), []],
  ])('finds the correct evaluations when the group has %s', async (_, groupId, expectedEvaluations) => {
    const readmodel = pipe(
      [
        evaluationRecorded(group1, article1, reviewId1, [], new Date(), new Date('2020-05-19T00:00:00Z')),
        evaluationRecorded(group1, article2, reviewId2, [], new Date(), new Date('2020-05-21T00:00:00Z')),
        evaluationRecorded(group2, article1, reviewId3, [], new Date(), new Date('2020-05-20T00:00:00Z')),
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const actualEvaluations = pipe(
      groupId,
      getEvaluationsByGroup(readmodel),
      RA.map((evaluation) => evaluation.reviewId),
    );

    expect(actualEvaluations).toStrictEqual(expectedEvaluations);
  });

  it.failing('does not return erased evaluations', () => {
    const readmodel = pipe(
      [
        evaluationRecorded(group1, article1, reviewId1, [], new Date(), new Date('2020-05-19T00:00:00Z')),
        evaluationRecorded(group1, article2, reviewId2, [], new Date(), new Date('2020-05-21T00:00:00Z')),
        incorrectlyRecordedEvaluationErased(reviewId1),
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const actualEvaluations = pipe(
      group1,
      getEvaluationsByGroup(readmodel),
      RA.map((evaluation) => evaluation.reviewId),
    );

    expect(actualEvaluations).toStrictEqual([reviewId2]);
  });
});
