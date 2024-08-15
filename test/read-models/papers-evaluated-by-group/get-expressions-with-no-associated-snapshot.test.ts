import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../../src/domain-events';
import {
  getExpressionsWithNoAssociatedSnapshot,
} from '../../../src/read-models/papers-evaluated-by-group/get-expressions-with-no-associated-snapshot';
import { initialState, handleEvent } from '../../../src/read-models/papers-evaluated-by-group/handle-event';
import { arbitraryPaperSnapshotRecordedEvent } from '../../domain-events/arbitrary-paper-snapshot-event.helper';
import { arbitraryEvaluationPublicationRecordedEvent } from '../../domain-events/evaluation-resource-events.helper';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';

const groupId = arbitraryGroupId();
const anotherGroupId = arbitraryGroupId();
const consideredGroupIds = [groupId, anotherGroupId];

const runQuery = (events: ReadonlyArray<DomainEvent>) => {
  const readModel = pipe(
    events,
    RA.reduce(initialState(), handleEvent(consideredGroupIds)),
  );
  return getExpressionsWithNoAssociatedSnapshot(readModel)();
};

describe('get-expressions-with-no-associated-snapshot', () => {
  const expressionDoiA = arbitraryExpressionDoi();
  const expressionDoiB = arbitraryExpressionDoi();
  const expressionDoiC = arbitraryExpressionDoi();
  const evaluationRecordedAgainstExpressionDoiA = {
    ...arbitraryEvaluationPublicationRecordedEvent(),
    groupId,
    articleId: expressionDoiA,
  };
  const evaluationRecordedAgainstExpressionDoiB = {
    ...arbitraryEvaluationPublicationRecordedEvent(),
    groupId,
    articleId: expressionDoiB,
  };
  const evaluationRecordedAgainstExpressionDoiC = {
    ...arbitraryEvaluationPublicationRecordedEvent(),
    groupId,
    articleId: expressionDoiC,
  };
  const paperSnapshotWithExpressionDoisAB = {
    ...arbitraryPaperSnapshotRecordedEvent(),
    expressionDois: [expressionDoiA, expressionDoiB],
  };
  const paperSnapshotWithExpressionDoisABC = {
    ...arbitraryPaperSnapshotRecordedEvent(),
    expressionDois: [expressionDoiA, expressionDoiB, expressionDoiC],
  };

  describe('when an evaluation has been recorded, and the evaluating group should be considered', () => {
    describe('but no corresponding paper snapshot is available', () => {
      const events = [
        evaluationRecordedAgainstExpressionDoiA,
      ] satisfies ReadonlyArray<DomainEvent>;

      it('returns the expression doi', () => {
        expect(runQuery(events)).toStrictEqual([expressionDoiA]);
      });
    });

    describe('then a corresponding paper snapshot has been recorded', () => {
      const events = [
        evaluationRecordedAgainstExpressionDoiA,
        paperSnapshotWithExpressionDoisAB,
      ] satisfies ReadonlyArray<DomainEvent>;

      it('returns empty', () => {
        expect(runQuery(events)).toStrictEqual([]);
      });
    });
  });

  describe('when an evaluation has been recorded, but the evaluating group should not be considered', () => {
    const events = [
      {
        ...evaluationRecordedAgainstExpressionDoiA,
        groupId: arbitraryGroupId(),
      },
    ] satisfies ReadonlyArray<DomainEvent>;

    it('returns empty', () => {
      expect(runQuery(events)).toStrictEqual([]);
    });
  });

  describe('when an evaluation has been recorded, then a corresponding paper snapshot recorded, and the expression is evaluated again', () => {
    const events = [
      evaluationRecordedAgainstExpressionDoiA,
      paperSnapshotWithExpressionDoisAB,
      evaluationRecordedAgainstExpressionDoiA,
    ] satisfies ReadonlyArray<DomainEvent>;

    it('returns empty', () => {
      expect(runQuery(events)).toStrictEqual([]);
    });
  });

  describe('when two expressions have been evaluated and belong to the same paper according to a snapshot', () => {
    const events = [
      evaluationRecordedAgainstExpressionDoiA,
      evaluationRecordedAgainstExpressionDoiB,
      paperSnapshotWithExpressionDoisAB,
    ] satisfies ReadonlyArray<DomainEvent>;

    it('returns empty', () => {
      expect(runQuery(events)).toStrictEqual([]);
    });
  });

  describe('when another expression of an already evaluated paper is evaluated', () => {
    const events = [
      evaluationRecordedAgainstExpressionDoiA,
      paperSnapshotWithExpressionDoisAB,
      evaluationRecordedAgainstExpressionDoiB,
    ] satisfies ReadonlyArray<DomainEvent>;

    it('returns empty', () => {
      expect(runQuery(events)).toStrictEqual([]);
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

    it('returns empty', () => {
      expect(runQuery(events)).toStrictEqual([]);
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

    it('returns empty', () => {
      expect(runQuery(events)).toStrictEqual([]);
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

    it('returns empty', () => {
      expect(runQuery(events)).toStrictEqual([]);
    });
  });
});
