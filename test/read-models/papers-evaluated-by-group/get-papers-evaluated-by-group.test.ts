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
  const expressionDoiA = arbitraryExpressionDoi();
  const expressionDoiB = arbitraryExpressionDoi();
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
  const paperSnapshotWithExpressionDoiAandB = {
    ...arbitraryPaperSnapshotRecordedEvent(),
    expressionDois: [expressionDoiA, expressionDoiB],
  };

  describe('when an evaluation has been recorded, but no corresponding paper snapshot is available', () => {
    const events = [
      evaluationRecordedAgainstExpressionDoiA,
    ] satisfies ReadonlyArray<DomainEvent>;

    it('does not return anything', () => {
      expect(runQuery(events, groupId)).toStrictEqual([]);
    });
  });

  describe('when an evaluation has been recorded and a corresponding paper snapshot is available', () => {
    const events = [
      evaluationRecordedAgainstExpressionDoiA,
      paperSnapshotWithExpressionDoiAandB,
    ] satisfies ReadonlyArray<DomainEvent>;

    it('returns the evaluated expression DOI', () => {
      expect(runQuery(events, groupId)).toStrictEqual([expressionDoiA]);
    });
  });

  describe('when an expression has been evaluated, a paper snapshot recorded and the expression is evaluated again', () => {
    const events = [
      evaluationRecordedAgainstExpressionDoiA,
      paperSnapshotWithExpressionDoiAandB,
      evaluationRecordedAgainstExpressionDoiA,
    ] satisfies ReadonlyArray<DomainEvent>;

    it('returns the evaluated expression DOI', () => {
      expect(runQuery(events, groupId)).toStrictEqual([expressionDoiA]);
    });
  });

  describe('when two expressions have been evaluated and belong to the same paper according to a snapshot', () => {
    const events = [
      evaluationRecordedAgainstExpressionDoiA,
      evaluationRecordedAgainstExpressionDoiB,
      paperSnapshotWithExpressionDoiAandB,
    ] satisfies ReadonlyArray<DomainEvent>;

    it('returns only one expression', () => {
      expect(runQuery(events, groupId)).toHaveLength(1);
      expect([expressionDoiA, expressionDoiB]).toContain(runQuery(events, groupId)[0]);
    });
  });

  describe('when another expression of an already added paper is evaluated', () => {
    const events = [
      evaluationRecordedAgainstExpressionDoiA,
      paperSnapshotWithExpressionDoiAandB,
      evaluationRecordedAgainstExpressionDoiB,
    ] satisfies ReadonlyArray<DomainEvent>;

    it('returns only one expression', () => {
      expect(runQuery(events, groupId)).toHaveLength(1);
      expect([expressionDoiA, expressionDoiB]).toContain(runQuery(events, groupId)[0]);
    });
  });
});
