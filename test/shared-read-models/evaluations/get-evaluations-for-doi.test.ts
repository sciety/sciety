import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { getEvaluationsForDoi } from '../../../src/shared-read-models/evaluations/get-evaluations-for-doi';
import { constructEvent } from '../../../src/domain-events';
import { evaluationRecordedHelper } from '../../types/evaluation-recorded-event.helper';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';
import { handleEvent, initialState } from '../../../src/shared-read-models/evaluations/handle-event';

describe('get-evaluations-for-doi', () => {
  const article1 = arbitraryDoi();
  const article2 = arbitraryDoi();
  const group1 = arbitraryGroupId();
  const group2 = arbitraryGroupId();
  const reviewId1 = arbitraryEvaluationLocator();
  const reviewId2 = arbitraryEvaluationLocator();
  const reviewId3 = arbitraryEvaluationLocator();

  describe('when there is an arbitrary number of evaluations', () => {
    it.each([
      ['two evaluations', article1, [reviewId1, reviewId3]],
      ['one evaluation', article2, [reviewId2]],
      ['no evaluations', arbitraryDoi(), []],
    ])('finds the correct evaluations when the article has %s', async (_, articleDoi, expectedEvaluations) => {
      const readmodel = pipe(
        [
          evaluationRecordedHelper(group1, article1, reviewId1, [], new Date(), new Date('2020-05-19T00:00:00Z')),
          evaluationRecordedHelper(group1, article2, reviewId2, [], new Date(), new Date('2020-05-21T00:00:00Z')),
          evaluationRecordedHelper(group2, article1, reviewId3, [], new Date(), new Date('2020-05-20T00:00:00Z')),
        ],
        RA.reduce(initialState(), handleEvent),
      );
      const actualEvaluations = pipe(
        articleDoi,
        getEvaluationsForDoi(readmodel),
        RA.map((evaluation) => evaluation.evaluationLocator),
      );

      expect(actualEvaluations).toStrictEqual(expectedEvaluations);
    });
  });

  describe('when an evaluation has been recorded and then erased', () => {
    it('does not return erased evaluations', () => {
      const readmodel = pipe(
        [
          evaluationRecordedHelper(group1, article1, reviewId1, [], new Date(), new Date('2020-05-19T00:00:00Z')),
          evaluationRecordedHelper(group2, article1, reviewId3, [], new Date(), new Date('2020-05-20T00:00:00Z')),
          constructEvent('IncorrectlyRecordedEvaluationErased')({ evaluationLocator: reviewId1 }),
        ],
        RA.reduce(initialState(), handleEvent),
      );
      const actualEvaluations = pipe(
        article1,
        getEvaluationsForDoi(readmodel),
        RA.map((evaluation) => evaluation.evaluationLocator),
      );

      expect(actualEvaluations).toStrictEqual([reviewId3]);
    });
  });

  describe('when the evaluation was recorded without a type, and a curation statement was recorded later', () => {
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
      article1,
      getEvaluationsForDoi(readmodel),
    );

    it('contains the right type', () => {
      expect(result[0].type).toStrictEqual(O.some('curation-statement'));
    });
  });

  describe('when the evaluation is recorded as a curation statement', () => {
    const readmodel = pipe(
      [
        evaluationRecordedHelper(group1, article1, reviewId1, [], new Date(), new Date('2020-05-19T00:00:00Z'), 'curation-statement'),
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const result = pipe(
      article1,
      getEvaluationsForDoi(readmodel),
    );

    it('contains the right type', () => {
      expect(result[0].type).toStrictEqual(O.some('curation-statement'));
    });
  });

  describe('when the evaluation is recorded as a review', () => {
    const readmodel = pipe(
      [
        evaluationRecordedHelper(group1, article1, reviewId1, [], new Date(), new Date('2020-05-19T00:00:00Z'), 'review'),
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const result = pipe(
      article1,
      getEvaluationsForDoi(readmodel),
    );

    it('contains the right type', () => {
      expect(result[0].type).toStrictEqual(O.some('review'));
    });
  });

  describe('when the evaluation is recorded as an author response', () => {
    const readmodel = pipe(
      [
        evaluationRecordedHelper(group1, article1, reviewId1, [], new Date(), new Date('2020-05-19T00:00:00Z'), 'author-response'),
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const result = pipe(
      article1,
      getEvaluationsForDoi(readmodel),
    );

    it('contains the right type', () => {
      expect(result[0].type).toStrictEqual(O.some('author-response'));
    });
  });

  describe('when the evaluation is recorded without any type', () => {
    const readmodel = pipe(
      [
        evaluationRecordedHelper(group1, article1, reviewId1, [], new Date(), new Date('2020-05-19T00:00:00Z'), undefined),
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const result = pipe(
      article1,
      getEvaluationsForDoi(readmodel),
    );

    it('does not contain a type', () => {
      expect(result[0].type).toStrictEqual(O.none);
    });
  });

  describe('when a previously recorded evaluation has its evaluation type updated', () => {
    it.todo('contains the new evaluation type');
  });

  describe('when an unknown evaluation is attempted to be updated', () => {
    it.todo('returns None');
  });
});
