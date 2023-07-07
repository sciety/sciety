import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { getEvaluationsForDoi } from '../../../src/shared-read-models/evaluations/get-evaluations-for-doi';
import { constructEvent, DomainEvent } from '../../../src/domain-events';
import { evaluationRecordedHelper } from '../../types/evaluation-recorded-event.helper';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';
import { handleEvent, initialState } from '../../../src/shared-read-models/evaluations/handle-event';
import { Doi } from '../../../src/types/doi';
import { GroupId } from '../../../src/types/group-id';
import { EvaluationLocator } from '../../../src/types/evaluation-locator';
import { EvaluationType } from '../../../src/types/recorded-evaluation';

const runQuery = (articleId: Doi) => (events: ReadonlyArray<DomainEvent>) => {
  const readmodel = pipe(
    events,
    RA.reduce(initialState(), handleEvent),
  );
  return pipe(
    articleId,
    getEvaluationsForDoi(readmodel),
  );
};

const evaluationRecorded = (groupId: GroupId, articleId: Doi, evaluationLocator: EvaluationLocator) => (
  evaluationRecordedHelper(groupId, articleId, evaluationLocator, [], new Date())
);

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
      const actualEvaluations = pipe(
        [
          evaluationRecorded(group1, article1, reviewId1),
          evaluationRecorded(group1, article2, reviewId2),
          evaluationRecorded(group2, article1, reviewId3),
        ],
        runQuery(articleDoi),
        RA.map((evaluation) => evaluation.evaluationLocator),
      );

      expect(actualEvaluations).toStrictEqual(expectedEvaluations);
    });
  });

  describe('when an evaluation has been recorded and then erased', () => {
    it('does not return erased evaluations', () => {
      const actualEvaluations = pipe(
        [
          evaluationRecorded(group1, article1, reviewId1),
          evaluationRecorded(group2, article1, reviewId3),
          constructEvent('IncorrectlyRecordedEvaluationErased')({ evaluationLocator: reviewId1 }),
        ],
        runQuery(article1),
        RA.map((evaluation) => evaluation.evaluationLocator),
      );

      expect(actualEvaluations).toStrictEqual([reviewId3]);
    });
  });

  describe('when the evaluation was recorded without a type, and a curation statement was recorded later', () => {
    const result = pipe(
      [
        evaluationRecorded(group1, article1, reviewId1),
        constructEvent('CurationStatementRecorded')({
          articleId: article1,
          groupId: group1,
          evaluationLocator: reviewId1,
        }),
      ],
      runQuery(article1),
    );

    it('contains the right type', () => {
      expect(result[0].type).toStrictEqual(O.some('curation-statement'));
    });
  });

  describe.each([
    ['curation-statement', O.some('curation-statement')],
    ['review', O.some('review')],
    ['author-response', O.some('author-response')],
    [undefined, O.none],
  ])('when the evaluation is recorded as a %s', (inputType, expectedType) => {
    const result = pipe(
      [
        evaluationRecordedHelper(
          group1,
          article1,
          reviewId1,
          [],
          new Date(),
          new Date(),
          inputType as unknown as EvaluationType,
        ),
      ],
      runQuery(article1),
    );

    it('contains the right type', () => {
      expect(result[0].type).toStrictEqual(expectedType);
    });
  });

  describe('when an evaluation has previously been recorded without an evaluation type, and has its evaluation type updated', () => {
    it('contains the new evaluation type', () => {
      const result = pipe(
        [
          evaluationRecordedHelper(group1, article1, reviewId1, [], new Date(), new Date(), undefined),
          constructEvent('EvaluationUpdated')({
            evaluationLocator: reviewId1,
            evaluationType: 'curation-statement',
          }),
        ],
        runQuery(article1),
      );

      expect(result[0].type).toStrictEqual(O.some('curation-statement'));
    });
  });

  describe('when an evaluation has previously been recorded with an evaluation type, and has its evaluation type updated to a different value', () => {
    it('contains the new evaluation type', () => {
      const result = pipe(
        [
          evaluationRecordedHelper(group1, article1, reviewId1, [], new Date(), new Date(), 'review'),
          constructEvent('EvaluationUpdated')({
            evaluationLocator: reviewId1,
            evaluationType: 'author-response',
          }),
        ],
        runQuery(article1),
      );

      expect(result[0].type).toStrictEqual(O.some('author-response'));
    });
  });
});
