/* eslint-disable no-loops/no-loops */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../../src/domain-events';
import { getPapersEvaluatedByGroup } from '../../../src/read-models/papers-evaluated-by-group/get-papers-evaluated-by-group';
import { initialState, handleEvent } from '../../../src/read-models/papers-evaluated-by-group/handle-event';
import { GroupId } from '../../../src/types/group-id';
import { arbitraryPaperSnapshotRecordedEvent } from '../../domain-events/arbitrary-paper-snapshot-event.helper';
import { arbitraryEvaluationPublicationRecordedEvent } from '../../domain-events/evaluation-resource-events.helper';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';

const runQuery = (events: ReadonlyArray<DomainEvent>, groupId: GroupId) => {
  const readModel = pipe(
    events,
    RA.reduce(initialState(), handleEvent),
  );
  return getPapersEvaluatedByGroup(readModel)(groupId);
};

describe('get-papers-evaluated-by-group', () => {
  const groupId = arbitraryGroupId();
  const anotherGroupId = arbitraryGroupId();
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

  describe('when an evaluation has been recorded against an expression, but no corresponding paper snapshot is available', () => {
    const events = [
      evaluationRecordedAgainstExpressionDoiA,
    ] satisfies ReadonlyArray<DomainEvent>;

    it('does not return anything', () => {
      expect(runQuery(events, groupId)).toStrictEqual([]);
    });
  });

  describe('when an evaluation has been recorded against an expression which is part of a subsequently recorded paper snapshot', () => {
    const events = [
      evaluationRecordedAgainstExpressionDoiA,
      paperSnapshotWithExpressionDoisAB,
    ] satisfies ReadonlyArray<DomainEvent>;

    it('returns a single expression DOI of the evaluated paper', () => {
      expect(runQuery(events, groupId)).toStrictEqual([expressionDoiA]);
    });
  });

  describe('when an expression has been evaluated, a paper snapshot recorded and the expression is evaluated again', () => {
    const events = [
      evaluationRecordedAgainstExpressionDoiA,
      paperSnapshotWithExpressionDoisAB,
      evaluationRecordedAgainstExpressionDoiA,
    ] satisfies ReadonlyArray<DomainEvent>;

    it('returns a single expression DOI of the evaluated paper', () => {
      expect(runQuery(events, groupId)).toStrictEqual([expressionDoiA]);
    });
  });

  describe('when two expressions have been evaluated and belong to the same paper according to a snapshot', () => {
    const events = [
      evaluationRecordedAgainstExpressionDoiA,
      evaluationRecordedAgainstExpressionDoiB,
      paperSnapshotWithExpressionDoisAB,
    ] satisfies ReadonlyArray<DomainEvent>;

    it('returns a single expression DOI of the evaluated paper', () => {
      expect(runQuery(events, groupId)).toHaveLength(1);
      expect([expressionDoiA, expressionDoiB]).toContain(runQuery(events, groupId)[0]);
    });
  });

  describe('when another expression of an already evaluated paper is evaluated', () => {
    const events = [
      evaluationRecordedAgainstExpressionDoiA,
      paperSnapshotWithExpressionDoisAB,
      evaluationRecordedAgainstExpressionDoiB,
    ] satisfies ReadonlyArray<DomainEvent>;

    it('returns a single expression DOI of the evaluated paper', () => {
      expect(runQuery(events, groupId)).toHaveLength(1);
      expect([expressionDoiA, expressionDoiB]).toContain(runQuery(events, groupId)[0]);
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

    it('returns a single expression DOI of the evaluated paper', () => {
      expect(runQuery(events, groupId)).toHaveLength(1);
      expect([expressionDoiA, expressionDoiB, expressionDoiC]).toContain(runQuery(events, groupId)[0]);
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

      expect(result).toHaveLength(1);
      expect([expressionDoiA, expressionDoiB]).toContain(result[0]);
    });

    it.failing('returns a single expression DOI of the evaluated paper for the other group', () => {
      const result = runQuery(events, anotherGroupId);

      expect(result).toHaveLength(1);
      expect([expressionDoiA, expressionDoiB]).toContain(result[0]);
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

      expect(result).toHaveLength(1);
      expect([expressionDoiA, expressionDoiB, expressionDoiC]).toContain(result[0]);
    });

    it('returns a single expression DOI of the evaluated paper for the other group', () => {
      const result = runQuery(events, groupId);

      expect(result).toHaveLength(1);
      expect([expressionDoiA, expressionDoiB, expressionDoiC]).toContain(result[0]);
    });
  });
});
