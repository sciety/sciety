import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { getEvaluationsOfExpression } from '../../../src/read-models/evaluations/get-evaluations-of-expression.js';
import { constructEvent, DomainEvent } from '../../../src/domain-events/index.js';
import { arbitraryEvaluationPublicationRecordedEvent, arbitraryEvaluationUpdatedEvent, arbitraryEvaluationRemovalRecordedEvent } from '../../domain-events/evaluation-resource-events.helper.js';
import { arbitraryGroupId } from '../../types/group-id.helper.js';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper.js';
import { handleEvent, initialState } from '../../../src/read-models/evaluations/handle-event.js';
import { EvaluationLocator } from '../../../src/types/evaluation-locator.js';
import { EvaluationType } from '../../../src/types/recorded-evaluation.js';
import { arbitraryDate, arbitraryString } from '../../helpers.js';
import * as EDOI from '../../../src/types/expression-doi.js';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper.js';

const runQuery = (expressionDoi: EDOI.ExpressionDoi) => (events: ReadonlyArray<DomainEvent>) => {
  const readmodel = pipe(
    events,
    RA.reduce(initialState(), handleEvent),
  );
  return pipe(
    expressionDoi,
    getEvaluationsOfExpression(readmodel),
  );
};

const evaluationRecorded = (expressionDoi: EDOI.ExpressionDoi, evaluationLocator: EvaluationLocator) => (
  {
    ...arbitraryEvaluationPublicationRecordedEvent(),
    articleId: expressionDoi,
    evaluationLocator,
  }
);

const evaluationRecordedWithType = (
  articleId: EDOI.ExpressionDoi,
  evaluationLocator: EvaluationLocator,
  evaluationType: EvaluationType,
) => ({
  ...arbitraryEvaluationPublicationRecordedEvent(),
  articleId,
  evaluationLocator,
  evaluationType,
});

describe('get-evaluations-of-expression', () => {
  describe('when there is an arbitrary number of evaluations', () => {
    const article1 = arbitraryExpressionDoi();
    const article2 = arbitraryExpressionDoi();
    const evaluationLocator1 = arbitraryEvaluationLocator();
    const evaluationLocator2 = arbitraryEvaluationLocator();
    const evaluationLocator3 = arbitraryEvaluationLocator();

    it.each([
      ['two evaluations', article1, [evaluationLocator1, evaluationLocator3]],
      ['one evaluation', article2, [evaluationLocator2]],
      ['no evaluations', arbitraryExpressionDoi(), []],
    ])('finds the correct evaluations when the article has %s', async (_, articleDoi, expectedEvaluations) => {
      const actualEvaluations = pipe(
        [
          evaluationRecorded(article1, evaluationLocator1),
          evaluationRecorded(article2, evaluationLocator2),
          evaluationRecorded(article1, evaluationLocator3),
        ],
        runQuery(articleDoi),
        RA.map((evaluation) => evaluation.evaluationLocator),
      );

      expect(actualEvaluations).toStrictEqual(expectedEvaluations);
    });
  });

  describe('when an evaluation has been recorded and then erased', () => {
    const articleId = arbitraryExpressionDoi();
    const evaluationLocator = arbitraryEvaluationLocator();
    const actualEvaluations = pipe(
      [
        evaluationRecorded(articleId, evaluationLocator),
        constructEvent('IncorrectlyRecordedEvaluationErased')({ evaluationLocator }),
      ],
      runQuery(articleId),
      RA.map((evaluation) => evaluation.evaluationLocator),
    );

    it('does not return erased evaluations', () => {
      expect(actualEvaluations).toStrictEqual([]);
    });
  });

  describe('when an evaluation publication and its removal have been recorded', () => {
    const articleId = arbitraryExpressionDoi();
    const evaluationLocator = arbitraryEvaluationLocator();
    const actualEvaluations = pipe(
      [
        evaluationRecorded(articleId, evaluationLocator),
        {
          ...arbitraryEvaluationRemovalRecordedEvent(),
          evaluationLocator,
        },
      ],
      runQuery(articleId),
      RA.map((evaluation) => evaluation.evaluationLocator),
    );

    it('does not return evaluations whose removal has been recorded', () => {
      expect(actualEvaluations).toStrictEqual([]);
    });
  });

  describe('when the evaluation was recorded without a type, and a curation statement was recorded later', () => {
    const articleId = arbitraryExpressionDoi();
    const evaluationLocator = arbitraryEvaluationLocator();
    const groupId = arbitraryGroupId();
    const result = pipe(
      [
        {
          ...arbitraryEvaluationPublicationRecordedEvent(),
          groupId,
          articleId,
          evaluationLocator,
        },
        constructEvent('EvaluationUpdated')({
          evaluationType: 'curation-statement',
          authors: undefined,
          evaluationLocator,
        }),
      ],
      runQuery(articleId),
    );

    it('contains the right type', () => {
      expect(result[0].type).toStrictEqual(O.some('curation-statement'));
    });
  });

  describe('when an evaluation is recorded', () => {
    const articleId = arbitraryExpressionDoi();

    describe.each([
      ['curation-statement', O.some('curation-statement')],
      ['review', O.some('review')],
      ['author-response', O.some('author-response')],
      [undefined, O.none],
    ])('as %s', (inputType, expectedType) => {
      const result = pipe(
        [
          evaluationRecordedWithType(
            articleId,
            arbitraryEvaluationLocator(),
            inputType as unknown as EvaluationType,
          ),
        ],
        runQuery(articleId),
      );

      it('the type is returned correctly', () => {
        expect(result[0].type).toStrictEqual(expectedType);
      });

      it('the updated date is the date of the recording', () => {
        expect(result[0].updatedAt).toStrictEqual(result[0].recordedAt);
      });
    });
  });

  describe('when an evaluation is updated later', () => {
    const articleId = arbitraryExpressionDoi();
    const evaluationLocator = arbitraryEvaluationLocator();

    describe.each([
      [undefined, 'curation-statement'],
      ['review', 'author-response'],
    ])('changing the evaluation type from %s to %s', (initialType, updatedType) => {
      const dateOfUpdate = arbitraryDate();
      const result = pipe(
        [
          evaluationRecordedWithType(
            articleId,
            evaluationLocator,
            initialType as unknown as EvaluationType,
          ),
          constructEvent('EvaluationUpdated')({
            ...arbitraryEvaluationUpdatedEvent(),
            evaluationLocator,
            evaluationType: updatedType as unknown as EvaluationType,
            date: dateOfUpdate,
          }),
        ],
        runQuery(articleId),
      );

      it('updates the evaluation type', () => {
        expect(result[0].type).toStrictEqual(O.some(updatedType));
      });

      it('the updated date is the date of the update', () => {
        expect(result[0].updatedAt).toStrictEqual(dateOfUpdate);
      });
    });
  });

  describe('when the authors of the evaluation are updated', () => {
    const dateOfUpdate = arbitraryDate();
    const articleId = arbitraryExpressionDoi();
    const evaluationLocator = arbitraryEvaluationLocator();
    const authors = [arbitraryString(), arbitraryString()];
    const result = pipe(
      [
        {
          ...arbitraryEvaluationPublicationRecordedEvent(),
          evaluationLocator,
          articleId,
        },
        {
          ...arbitraryEvaluationUpdatedEvent(),
          evaluationLocator,
          authors,
          date: dateOfUpdate,
        },
      ],
      runQuery(articleId),
    );

    it('updates evaluation authors', () => {
      expect(result[0].authors).toStrictEqual(authors);
    });

    it('the updated date is the date of the update', () => {
      expect(result[0].updatedAt).toStrictEqual(dateOfUpdate);
    });
  });

  describe('when the evaluation has been recorded multiple times', () => {
    const articleId = arbitraryExpressionDoi();
    const evaluationLocator = arbitraryEvaluationLocator();
    const actualEvaluations = pipe(
      [
        evaluationRecorded(articleId, evaluationLocator),
        evaluationRecorded(articleId, evaluationLocator),
      ],
      runQuery(articleId),
      RA.map((evaluation) => evaluation.evaluationLocator),
    );

    it('returns only one evaluation', () => {
      expect(actualEvaluations).toHaveLength(1);
    });
  });
});
