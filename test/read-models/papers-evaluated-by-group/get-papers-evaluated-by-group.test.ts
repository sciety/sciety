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

  describe('when an evaluation has been recorded, but no corresponding paper snapshot is available', () => {
    const events = [
      {
        ...arbitraryEvaluationPublicationRecordedEvent(),
        groupId,
      },
    ] satisfies ReadonlyArray<DomainEvent>;

    it('does not return anything', () => {
      expect(runQuery(events, groupId)).toStrictEqual([]);
    });
  });

  describe('when an evaluation has been recorded and a corresponding paper snapshot is available', () => {
    const expressionDoi = arbitraryExpressionDoi();
    const events = [
      {
        ...arbitraryEvaluationPublicationRecordedEvent(),
        groupId,
        articleId: expressionDoi,
      },
      {
        ...arbitraryPaperSnapshotRecordedEvent(),
        expressionDois: [expressionDoi],
      },
    ] satisfies ReadonlyArray<DomainEvent>;

    it('returns the evaluated expression DOI', () => {
      expect(runQuery(events, groupId)).toStrictEqual([expressionDoi]);
    });
  });

  describe('when an expression has been evaluated, a paper snapshot recorded and the expression is evaluated again', () => {
    const expressionDoi = arbitraryExpressionDoi();
    const events = [
      {
        ...arbitraryEvaluationPublicationRecordedEvent(),
        groupId,
        articleId: expressionDoi,
      },
      {
        ...arbitraryPaperSnapshotRecordedEvent(),
        expressionDois: [expressionDoi],
      },
      {
        ...arbitraryEvaluationPublicationRecordedEvent(),
        groupId,
        articleId: expressionDoi,
      },
    ] satisfies ReadonlyArray<DomainEvent>;

    it('returns the evaluated expression DOI', () => {
      expect(runQuery(events, groupId)).toStrictEqual([expressionDoi]);
    });
  });

  describe('when two expressions have been evaluated and belong to the same paper according to a snapshot', () => {
    const expressionDoi = arbitraryExpressionDoi();
    const expressionDoiOfMoreRecentlyRecordedEvaluation = arbitraryExpressionDoi();
    const events = [
      {
        ...arbitraryEvaluationPublicationRecordedEvent(),
        groupId,
        articleId: expressionDoi,
      },
      {
        ...arbitraryEvaluationPublicationRecordedEvent(),
        groupId,
        articleId: expressionDoiOfMoreRecentlyRecordedEvaluation,
      },
      {
        ...arbitraryPaperSnapshotRecordedEvent(),
        expressionDois: [expressionDoi, expressionDoiOfMoreRecentlyRecordedEvaluation],
      },
    ] satisfies ReadonlyArray<DomainEvent>;

    it('returns only one expression', () => {
      expect(runQuery(events, groupId)).toHaveLength(1);
      expect([expressionDoi, expressionDoiOfMoreRecentlyRecordedEvaluation]).toContain(runQuery(events, groupId)[0]);
    });
  });
});
