import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../src/domain-events';
import { isCurationStatement } from '../../../src/read-models/evaluations';
import { getEvaluationsByGroup } from '../../../src/read-models/evaluations/get-evaluations-by-group';
import { handleEvent, initialState } from '../../../src/read-models/evaluations/handle-event';
import { arbitraryEvaluationPublicationRecordedEvent } from '../../domain-events/evaluation-resource-events.helper';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';

describe('get-evaluations-by-group', () => {
  const article1 = arbitraryExpressionDoi();
  const article2 = arbitraryExpressionDoi();
  const group1 = arbitraryGroupId();
  const group2 = arbitraryGroupId();
  const evaluationLocator1 = arbitraryEvaluationLocator();
  const evaluationLocator2 = arbitraryEvaluationLocator();
  const evaluationLocator3 = arbitraryEvaluationLocator();

  describe.each([
    ['two evaluations', group1, [evaluationLocator1, evaluationLocator2]],
    ['one evaluation', group2, [evaluationLocator3]],
    ['no evaluations', arbitraryGroupId(), []],
  ])('when the group has %s', (_, groupId, expectedEvaluations) => {
    const readmodel = pipe(
      [
        {
          ...arbitraryEvaluationPublicationRecordedEvent(),
          groupId: group1,
          articleId: article1,
          evaluationLocator: evaluationLocator1,
          date: new Date('2020-05-19T00:00:00Z'),
        },
        {
          ...arbitraryEvaluationPublicationRecordedEvent(),
          groupId: group1,
          articleId: article2,
          evaluationLocator: evaluationLocator2,
          date: new Date('2020-05-21T00:00:00Z'),
        },
        {
          ...arbitraryEvaluationPublicationRecordedEvent(),
          groupId: group2,
          articleId: article1,
          evaluationLocator: evaluationLocator3,
          date: new Date('2020-05-20T00:00:00Z'),
        },
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
        {
          ...arbitraryEvaluationPublicationRecordedEvent(),
          groupId: group1,
          articleId: article1,
          evaluationLocator: evaluationLocator1,
          date: new Date('2020-05-19T00:00:00Z'),
        },
        {
          ...arbitraryEvaluationPublicationRecordedEvent(),
          groupId: group1,
          articleId: article2,
          evaluationLocator: evaluationLocator2,
          date: new Date('2020-05-21T00:00:00Z'),
        },
        constructEvent('IncorrectlyRecordedEvaluationErased')({ evaluationLocator: evaluationLocator1 }),
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const actualEvaluations = pipe(
      group1,
      getEvaluationsByGroup(readmodel),
      RA.map((evaluation) => evaluation.evaluationLocator),
    );

    expect(actualEvaluations).toStrictEqual([evaluationLocator2]);
  });

  describe('when the evaluation is a curation statement', () => {
    const readmodel = pipe(
      [
        {
          ...arbitraryEvaluationPublicationRecordedEvent(),
          groupId: group1,
          articleId: article1,
          evaluationLocator: evaluationLocator1,
          date: new Date('2020-05-19T00:00:00Z'),
        },
        constructEvent('EvaluationUpdated')({
          evaluationType: 'curation-statement',
          authors: undefined,
          evaluationLocator: evaluationLocator1,
        }),
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const result = pipe(
      group1,
      getEvaluationsByGroup(readmodel),
    );

    it('sets the type correctly', () => {
      expect(isCurationStatement(result[0])).toBe(true);
    });
  });
});
