/* eslint-disable no-loops/no-loops */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { DomainEvent, isEventOfType } from '../../../src/domain-events';
import { ExpressionDoi } from '../../../src/types/expression-doi';
import { GroupId } from '../../../src/types/group-id';
import { arbitraryPaperSnapshotRecordedEvent } from '../../domain-events/arbitrary-paper-snapshot-event.helper';
import { arbitraryEvaluationPublicationRecordedEvent } from '../../domain-events/evaluation-resource-events.helper';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';

type ReadModel = {
  papersEvaluatedByGroupId: Record<GroupId, Array<ExpressionDoi>>,
  evaluatedExpressionsWithoutPaperSnapshot: Record<GroupId, Set<ExpressionDoi>>,
};

const initialState = (): ReadModel => ({
  papersEvaluatedByGroupId: {},
  evaluatedExpressionsWithoutPaperSnapshot: {},
});

const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEventOfType('EvaluationPublicationRecorded')(event)) {
    const current = readmodel.evaluatedExpressionsWithoutPaperSnapshot[event.groupId] ?? new Set();
    const updated = current.add(event.articleId);
    readmodel.evaluatedExpressionsWithoutPaperSnapshot[event.groupId] = updated;
  }
  if (isEventOfType('PaperSnapshotRecorded')(event)) {
    for (
      const [groupId, expressionsWithoutPaperSnapshot]
      of Object.entries(readmodel.evaluatedExpressionsWithoutPaperSnapshot)
    ) {
      if (!(groupId in readmodel.papersEvaluatedByGroupId)) {
        readmodel.papersEvaluatedByGroupId[groupId as GroupId] = [];
      }
      event.expressionDois.forEach((expressionDoi) => {
        if (expressionsWithoutPaperSnapshot.has(expressionDoi)) {
          expressionsWithoutPaperSnapshot.delete(expressionDoi);
          readmodel.papersEvaluatedByGroupId[groupId as GroupId].push(expressionDoi);
        }
      });
    }
  }
  return readmodel;
};

const getPapersEvaluatedByGroup = (readModel: ReadModel) => (groupId: GroupId) => pipe(
  readModel.papersEvaluatedByGroupId,
  R.lookup(groupId),
  O.getOrElseW(() => []),
);

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
});
