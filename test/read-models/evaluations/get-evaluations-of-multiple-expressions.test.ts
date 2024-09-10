import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent, DomainEvent } from '../../../src/domain-events';
import { getEvaluationsOfMultipleExpressions } from '../../../src/read-models/evaluations/get-evaluations-of-multiple-expressions';
import { handleEvent, initialState } from '../../../src/read-models/evaluations/handle-event';
import { EvaluationLocator } from '../../../src/types/evaluation-locator';
import { EvaluationType } from '../../../src/types/evaluation-type';
import { ExpressionDoi } from '../../../src/types/expression-doi';
import { arbitraryEvaluationPublicationRecordedEvent, arbitraryEvaluationUpdatedEvent, arbitraryEvaluationRemovalRecordedEvent } from '../../domain-events/evaluation-resource-events.helper';
import { arbitraryDate, arbitraryString } from '../../helpers';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';

const runQuery = (expressionDois: ReadonlyArray<ExpressionDoi>) => (events: ReadonlyArray<DomainEvent>) => {
  const readmodel = pipe(
    events,
    RA.reduce(initialState(), handleEvent),
  );
  return getEvaluationsOfMultipleExpressions(readmodel)(expressionDois);
};

const evaluationRecorded = (
  expressionDoi: ExpressionDoi,
  evaluationLocator: EvaluationLocator,
) => ({
  ...arbitraryEvaluationPublicationRecordedEvent(),
  articleId: expressionDoi,
  evaluationLocator,
});

const evaluationRecordedWithType = (
  expressionDoi: ExpressionDoi,
  evaluationLocator: EvaluationLocator,
  evaluationType: EvaluationType,
) => ({
  ...arbitraryEvaluationPublicationRecordedEvent(),
  articleId: expressionDoi,
  evaluationLocator,
  evaluationType,
});

describe('get-evaluations-of-multiple-expressions', () => {
  describe('when only one expression doi is passed in', () => {
    const expressionDoi = arbitraryExpressionDoi();

    describe('and it has some evaluations', () => {
      const expressionDoi1 = arbitraryExpressionDoi();
      const evaluationLocator1 = arbitraryEvaluationLocator();

      const evaluationLocators = pipe(
        [
          evaluationRecorded(expressionDoi1, evaluationLocator1),
          evaluationRecorded(arbitraryExpressionDoi(), arbitraryEvaluationLocator()),
        ],
        runQuery([expressionDoi1]),
        RA.map((evaluation) => evaluation.evaluationLocator),
      );

      it('returns all evaluations for only that expression', () => {
        expect(evaluationLocators).toStrictEqual([evaluationLocator1]);
      });
    });

    describe('and it has no evaluations', () => {
      const evaluations = pipe(
        [],
        runQuery([expressionDoi]),
      );

      it('returns no evaluations', () => {
        expect(evaluations).toHaveLength(0);
      });
    });

    describe('and it has one evaluation', () => {
      const evaluations = pipe(
        [
          evaluationRecorded(expressionDoi, arbitraryEvaluationLocator()),
        ],
        runQuery([expressionDoi]),
      );

      it('returns one evaluation', () => {
        expect(evaluations).toHaveLength(1);
      });
    });

    describe('and it has two evaluations', () => {
      const evaluations = pipe(
        [
          evaluationRecorded(expressionDoi, arbitraryEvaluationLocator()),
          evaluationRecorded(expressionDoi, arbitraryEvaluationLocator()),
        ],
        runQuery([expressionDoi]),
      );

      it('returns two evaluations', () => {
        expect(evaluations).toHaveLength(2);
      });
    });

    describe('when an evaluation has been recorded and then erased', () => {
      const evaluationLocator = arbitraryEvaluationLocator();
      const actualEvaluations = pipe(
        [
          evaluationRecorded(expressionDoi, evaluationLocator),
          constructEvent('IncorrectlyRecordedEvaluationErased')({ evaluationLocator }),
        ],
        runQuery([expressionDoi]),
        RA.map((evaluation) => evaluation.evaluationLocator),
      );

      it('does not return erased evaluations', () => {
        expect(actualEvaluations).toStrictEqual([]);
      });
    });

    describe('when an evaluation publication and its removal have been recorded', () => {
      const evaluationLocator = arbitraryEvaluationLocator();
      const actualEvaluations = pipe(
        [
          evaluationRecorded(expressionDoi, evaluationLocator),
          {
            ...arbitraryEvaluationRemovalRecordedEvent(),
            evaluationLocator,
          },
        ],
        runQuery([expressionDoi]),
        RA.map((evaluation) => evaluation.evaluationLocator),
      );

      it('does not return evaluations whose removal has been recorded', () => {
        expect(actualEvaluations).toStrictEqual([]);
      });
    });

    describe('when the evaluation was recorded without a type, and a curation statement was recorded later', () => {
      const evaluationLocator = arbitraryEvaluationLocator();
      const groupId = arbitraryGroupId();
      const result = pipe(
        [
          {
            ...arbitraryEvaluationPublicationRecordedEvent(),
            groupId,
            articleId: expressionDoi,
            evaluationLocator,
          },
          constructEvent('EvaluationUpdated')({
            evaluationType: 'curation-statement',
            authors: undefined,
            evaluationLocator,
          }),
        ],
        runQuery([expressionDoi]),
      );

      it('contains the right type', () => {
        expect(result[0].type).toStrictEqual(O.some('curation-statement'));
      });
    });

    describe('when an evaluation is recorded', () => {
      describe.each([
        ['curation-statement', O.some('curation-statement')],
        ['review', O.some('review')],
        ['author-response', O.some('author-response')],
        [undefined, O.none],
      ])('as %s', (inputType, expectedType) => {
        const result = pipe(
          [
            evaluationRecordedWithType(
              expressionDoi,
              arbitraryEvaluationLocator(),
              inputType as unknown as EvaluationType,
            ),
          ],
          runQuery([expressionDoi]),
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
      const evaluationLocator = arbitraryEvaluationLocator();

      describe.each([
        [undefined, 'curation-statement'],
        ['review', 'author-response'],
      ])('changing the evaluation type from %s to %s', (initialType, updatedType) => {
        const dateOfUpdate = arbitraryDate();
        const result = pipe(
          [
            evaluationRecordedWithType(
              expressionDoi,
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
          runQuery([expressionDoi]),
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
      const evaluationLocator = arbitraryEvaluationLocator();
      const authors = [arbitraryString(), arbitraryString()];
      const result = pipe(
        [
          {
            ...arbitraryEvaluationPublicationRecordedEvent(),
            evaluationLocator,
            articleId: expressionDoi,
          },
          {
            ...arbitraryEvaluationUpdatedEvent(),
            evaluationLocator,
            authors,
            date: dateOfUpdate,
          },
        ],
        runQuery([expressionDoi]),
      );

      it('updates evaluation authors', () => {
        expect(result[0].authors).toStrictEqual(authors);
      });

      it('the updated date is the date of the update', () => {
        expect(result[0].updatedAt).toStrictEqual(dateOfUpdate);
      });
    });

    describe('when the evaluation has been recorded multiple times', () => {
      const evaluationLocator = arbitraryEvaluationLocator();
      const actualEvaluations = pipe(
        [
          evaluationRecorded(expressionDoi, evaluationLocator),
          evaluationRecorded(expressionDoi, evaluationLocator),
        ],
        runQuery([expressionDoi]),
        RA.map((evaluation) => evaluation.evaluationLocator),
      );

      it('returns only one evaluation', () => {
        expect(actualEvaluations).toHaveLength(1);
      });
    });
  });

  describe('when two different expression dois are passed in', () => {
    const expressionDoi1 = arbitraryExpressionDoi();
    const expressionDoi2 = arbitraryExpressionDoi();

    describe('and each expression has one evaluation recorded against it', () => {
      const evaluations = pipe(
        [
          evaluationRecorded(expressionDoi1, arbitraryEvaluationLocator()),
          evaluationRecorded(expressionDoi2, arbitraryEvaluationLocator()),
        ],
        runQuery([expressionDoi1, expressionDoi2]),
      );

      it('returns two evaluations', () => {
        expect(evaluations).toHaveLength(2);
      });
    });
  });

  describe('when two identical expression dois are passed in', () => {
    const expressionDoi = arbitraryExpressionDoi();

    describe('and the expression has one evaluation recorded against it', () => {
      const evaluations = pipe(
        [
          evaluationRecorded(expressionDoi, arbitraryEvaluationLocator()),
        ],
        runQuery([expressionDoi, expressionDoi]),
      );

      it('returns one evaluation', () => {
        expect(evaluations).toHaveLength(1);
      });
    });
  });
});
