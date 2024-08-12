/* eslint-disable no-param-reassign */
/* eslint-disable no-loops/no-loops */
import { DomainEvent, EventOfType, isEventOfType } from '../../domain-events';
import { ExpressionDoi } from '../../types/expression-doi';
import { GroupId } from '../../types/group-id';

export type ReadModel = {
  papersEvaluatedByGroupId: Record<GroupId, Array<ExpressionDoi>>,
  evaluatedExpressionsWithoutPaperSnapshot: Record<GroupId, Set<ExpressionDoi>>,
};

export const initialState = (): ReadModel => ({
  papersEvaluatedByGroupId: {},
  evaluatedExpressionsWithoutPaperSnapshot: {},
});

const ensureGroupIdExists = (readmodel: ReadModel, groupId: GroupId) => {
  if (!(groupId in readmodel.evaluatedExpressionsWithoutPaperSnapshot)) {
    readmodel.evaluatedExpressionsWithoutPaperSnapshot[groupId] = new Set<ExpressionDoi>();
  }
  if (!(groupId in readmodel.papersEvaluatedByGroupId)) {
    readmodel.papersEvaluatedByGroupId[groupId as GroupId] = [];
  }
};

const handleEvaluationPublicationRecorded = (event: EventOfType<'EvaluationPublicationRecorded'>, readmodel: ReadModel) => {
  ensureGroupIdExists(readmodel, event.groupId);
  readmodel.evaluatedExpressionsWithoutPaperSnapshot[event.groupId].add(event.articleId);
};

const handlePaperSnapshotRecorded = (event: EventOfType<'PaperSnapshotRecorded'>, readmodel: ReadModel) => {
  for (
    const [groupId, expressionsWithoutPaperSnapshot]
    of Object.entries(readmodel.evaluatedExpressionsWithoutPaperSnapshot)
  ) {
    ensureGroupIdExists(readmodel, groupId as GroupId);
    event.expressionDois.forEach((expressionDoi) => {
      if (expressionsWithoutPaperSnapshot.delete(expressionDoi)) {
        readmodel.papersEvaluatedByGroupId[groupId as GroupId].push(expressionDoi);
      }
    });
  }
};

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEventOfType('EvaluationPublicationRecorded')(event)) {
    handleEvaluationPublicationRecorded(event, readmodel);
  }
  if (isEventOfType('PaperSnapshotRecorded')(event)) {
    handlePaperSnapshotRecorded(event, readmodel);
  }
  return readmodel;
};
