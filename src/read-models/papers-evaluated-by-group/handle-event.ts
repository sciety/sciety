/* eslint-disable no-param-reassign */
/* eslint-disable no-loops/no-loops */
import { DomainEvent, EventOfType, isEventOfType } from '../../domain-events';
import { ExpressionDoi } from '../../types/expression-doi';
import { GroupId } from '../../types/group-id';

export type ReadModel = {
  papersEvaluatedByGroupId: Record<GroupId, Array<ExpressionDoi>>,
  evaluatedExpressionsWithoutPaperSnapshot: Record<GroupId, Set<ExpressionDoi>>,
  paperSnapshots: Array<Array<ExpressionDoi>>,
};

export const initialState = (): ReadModel => ({
  papersEvaluatedByGroupId: {},
  evaluatedExpressionsWithoutPaperSnapshot: {},
  paperSnapshots: [[]],
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

const hasIntersection = (
  paperExpressionDois: EventOfType<'PaperSnapshotRecorded'>['expressionDois'],
  knownEvaluatedPapers: ReadModel['papersEvaluatedByGroupId'][GroupId],
) => {
  const intersection = paperExpressionDois.filter((expression) => knownEvaluatedPapers.includes(expression));
  return intersection.length > 0;
};

const updateKnownEvaluatedPapers = (
  knownEvaluatedPapers: ReadModel['papersEvaluatedByGroupId'][GroupId],
  paperExpressionDois: EventOfType<'PaperSnapshotRecorded'>['expressionDois'],
  queueOfExpressionsWithoutPaperSnapshot: ReadModel['evaluatedExpressionsWithoutPaperSnapshot'][GroupId],
) => {
  paperExpressionDois.forEach((paperExpressionDoi) => {
    const paperExpressionWasInQueue = queueOfExpressionsWithoutPaperSnapshot.delete(paperExpressionDoi);
    const noExpressionOfThePaperIsInEvaluatedPapers = !hasIntersection(paperExpressionDois, knownEvaluatedPapers);
    if (paperExpressionWasInQueue && noExpressionOfThePaperIsInEvaluatedPapers) {
      knownEvaluatedPapers.push(paperExpressionDoi);
    }
  });
};

const handlePaperSnapshotRecorded = (event: EventOfType<'PaperSnapshotRecorded'>, readmodel: ReadModel) => {
  for (
    const [groupId, expressionsWithoutPaperSnapshot]
    of Object.entries(readmodel.evaluatedExpressionsWithoutPaperSnapshot)
  ) {
    ensureGroupIdExists(readmodel, groupId as GroupId);
    const knownEvaluatedPapers = readmodel.papersEvaluatedByGroupId[groupId as GroupId];
    updateKnownEvaluatedPapers(knownEvaluatedPapers, event.expressionDois, expressionsWithoutPaperSnapshot);
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
