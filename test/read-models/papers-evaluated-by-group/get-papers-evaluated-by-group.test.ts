/* eslint-disable jest/expect-expect */
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent, EventOfType } from '../../../src/domain-events';
import { getPapersEvaluatedByGroup } from '../../../src/read-models/papers-evaluated-by-group/get-papers-evaluated-by-group';
import { initialState, handleEvent } from '../../../src/read-models/papers-evaluated-by-group/handle-event';
import { ExpressionDoi } from '../../../src/types/expression-doi';
import { GroupId } from '../../../src/types/group-id';
import { arbitraryPaperSnapshotRecordedEvent } from '../../domain-events/arbitrary-paper-snapshot-event.helper';
import { arbitraryEvaluationPublicationRecordedEvent } from '../../domain-events/evaluation-resource-events.helper';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';

const groupId = arbitraryGroupId();
const anotherGroupId = arbitraryGroupId();
const consideredGroupIds = [groupId, anotherGroupId];

const runQuery = (events: ReadonlyArray<DomainEvent>, queriedGroupId: GroupId) => {
  const readModel = pipe(
    events,
    RA.reduce(initialState(), handleEvent(consideredGroupIds)),
  );
  return getPapersEvaluatedByGroup(readModel)(queriedGroupId);
};

const expectSingleExpressionDoiIn = (result: ReadonlySet<ExpressionDoi>, expressionDoi: ExpressionDoi) => {
  expect(result.size).toBe(1);
  expect(result).toContain(expressionDoi);
};

describe('get-papers-evaluated-by-group', () => {
  const expressionDoiA = arbitraryExpressionDoi();
  const expressionDoiB = arbitraryExpressionDoi();
  const expressionDoiC = arbitraryExpressionDoi();
  const evaluationRecordedAgainstExpressionDoiA: EventOfType<'EvaluationPublicationRecorded'> = {
    ...arbitraryEvaluationPublicationRecordedEvent(),
    groupId,
    articleId: expressionDoiA,
  };
  const evaluationRecordedAgainstExpressionDoiB: EventOfType<'EvaluationPublicationRecorded'> = {
    ...arbitraryEvaluationPublicationRecordedEvent(),
    groupId,
    articleId: expressionDoiB,
  };
  const evaluationRecordedAgainstExpressionDoiC: EventOfType<'EvaluationPublicationRecorded'> = {
    ...arbitraryEvaluationPublicationRecordedEvent(),
    groupId,
    articleId: expressionDoiC,
  };
  const paperSnapshotWithExpressionDoisAB: EventOfType<'PaperSnapshotRecorded'> = {
    ...arbitraryPaperSnapshotRecordedEvent(),
    expressionDois: new Set([expressionDoiA, expressionDoiB]),
  };
  const paperSnapshotWithExpressionDoisABC: EventOfType<'PaperSnapshotRecorded'> = {
    ...arbitraryPaperSnapshotRecordedEvent(),
    expressionDois: new Set([expressionDoiA, expressionDoiB, expressionDoiC]),
  };

  describe('given activity by considered groups', () => {
    describe('when an evaluation has been recorded against an expression, but no corresponding paper snapshot is available', () => {
      const events = [
        evaluationRecordedAgainstExpressionDoiA,
      ] satisfies ReadonlyArray<DomainEvent>;

      it('does not return anything', () => {
        expect(runQuery(events, groupId).size).toBe(0);
      });
    });

    describe('when an evaluation has been recorded against an expression which is part of a subsequently recorded paper snapshot', () => {
      const events = [
        evaluationRecordedAgainstExpressionDoiA,
        paperSnapshotWithExpressionDoisAB,
      ] satisfies ReadonlyArray<DomainEvent>;
      const result = runQuery(events, groupId);

      it('returns a single expression DOI of the evaluated paper', () => {
        expectSingleExpressionDoiIn(result, expressionDoiA);
      });
    });

    describe('when an expression has been evaluated, a paper snapshot recorded and the expression is evaluated again', () => {
      const events = [
        evaluationRecordedAgainstExpressionDoiA,
        paperSnapshotWithExpressionDoisAB,
        evaluationRecordedAgainstExpressionDoiA,
      ] satisfies ReadonlyArray<DomainEvent>;

      const result = runQuery(events, groupId);

      it('returns a single expression DOI of the evaluated paper', () => {
        expect(result.size).toBe(1);
        expect(result).toContain(expressionDoiA);
      });
    });

    describe('when two expressions have been evaluated and belong to the same paper according to a snapshot', () => {
      const events = [
        evaluationRecordedAgainstExpressionDoiA,
        evaluationRecordedAgainstExpressionDoiB,
        paperSnapshotWithExpressionDoisAB,
      ] satisfies ReadonlyArray<DomainEvent>;
      const result = runQuery(events, groupId);

      it('returns a single expression DOI of the evaluated paper', () => {
        expect(result.size).toBe(1);
        expect(result).toContain(expressionDoiA);
      });
    });

    describe('when another expression of an already evaluated paper is evaluated', () => {
      const events = [
        evaluationRecordedAgainstExpressionDoiA,
        paperSnapshotWithExpressionDoisAB,
        evaluationRecordedAgainstExpressionDoiB,
      ] satisfies ReadonlyArray<DomainEvent>;
      const result = runQuery(events, groupId);

      it('returns a single expression DOI of the evaluated paper', () => {
        expect(result.size).toBe(1);
        expect(result).toContain(expressionDoiA);
      });
    });

    describe('when an expression is evaluated that was not in the first snapshot but in the second snapshot', () => {
      const events = [
        evaluationRecordedAgainstExpressionDoiA,
        paperSnapshotWithExpressionDoisAB,
        evaluationRecordedAgainstExpressionDoiB,
        evaluationRecordedAgainstExpressionDoiC,
        paperSnapshotWithExpressionDoisABC,
      ] satisfies ReadonlyArray<DomainEvent>;
      const result = runQuery(events, groupId);

      it('returns a single expression DOI of the evaluated paper', () => {
        expect(result.size).toBe(1);
        expect(result).toContain(expressionDoiA);
      });
    });

    describe('when the paper snapshot has been recorded and then another group evaluates the paper', () => {
      const events = [
        evaluationRecordedAgainstExpressionDoiA,
        paperSnapshotWithExpressionDoisAB,
        {
          ...evaluationRecordedAgainstExpressionDoiA,
          groupId: anotherGroupId,
        },
      ] satisfies ReadonlyArray<DomainEvent>;

      it('returns a single expression DOI of the evaluated paper for the first group', () => {
        const result = runQuery(events, groupId);

        expect(result.size).toBe(1);
        expect(result).toContain(expressionDoiA);
      });

      it('returns a single expression DOI of the evaluated paper for the other group', () => {
        const result = runQuery(events, anotherGroupId);

        expect(result.size).toBe(1);
        expect(result).toContain(expressionDoiA);
      });
    });

    describe('when two groups evaluate different expressions that belong to the same paper', () => {
      const events = [
        evaluationRecordedAgainstExpressionDoiA,
        paperSnapshotWithExpressionDoisAB,
        {
          ...evaluationRecordedAgainstExpressionDoiC,
          groupId: anotherGroupId,
        },
        paperSnapshotWithExpressionDoisABC,
      ];

      it('returns a single expression DOI of the evaluated paper for the first group', () => {
        const result = runQuery(events, anotherGroupId);

        expect(result.size).toBe(1);
        expect(result).toContain(expressionDoiC);
      });

      it('returns a single expression DOI of the evaluated paper for the other group', () => {
        const result = runQuery(events, groupId);

        expect(result.size).toBe(1);
        expect(result).toContain(expressionDoiA);
      });
    });
  });

  describe('given activity by a group not considered', () => {
    const groupIdNotConsidered = arbitraryGroupId();

    describe('when an evaluation has been recorded against an expression which is part of a subsequently recorded paper snapshot', () => {
      const events = [
        {
          ...evaluationRecordedAgainstExpressionDoiA,
          groupId: groupIdNotConsidered,
        },
        paperSnapshotWithExpressionDoisAB,
      ] satisfies ReadonlyArray<DomainEvent>;
      const result = runQuery(events, groupIdNotConsidered);

      it('does not return anything', () => {
        expect(result.size).toBe(0);
      });
    });
  });
});
