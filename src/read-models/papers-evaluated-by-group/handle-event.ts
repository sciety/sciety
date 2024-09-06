/* eslint-disable no-param-reassign */
/* eslint-disable no-loops/no-loops */
import { DomainEvent, EventOfType, isEventOfType } from '../../domain-events';
import { ExpressionDoi } from '../../types/expression-doi';
import { GroupId } from '../../types/group-id';

type PaperSnapshotRepresentative = ExpressionDoi;

type PaperSnapshot = ReadonlyArray<ExpressionDoi>;

export type ReadModel = {
  paperSnapshotRepresentatives: Record<GroupId, Array<PaperSnapshotRepresentative>>,
  evaluatedExpressionsWithoutPaperSnapshot: Record<GroupId, Set<ExpressionDoi>>,
  paperSnapshots: Record<ExpressionDoi, PaperSnapshot>,
};

export const initialState = (): ReadModel => ({
  paperSnapshotRepresentatives: {},
  evaluatedExpressionsWithoutPaperSnapshot: {},
  paperSnapshots: {},
});

const ensureGroupIdExists = (readmodel: ReadModel, groupId: GroupId) => {
  if (!(groupId in readmodel.evaluatedExpressionsWithoutPaperSnapshot)) {
    readmodel.evaluatedExpressionsWithoutPaperSnapshot[groupId] = new Set<ExpressionDoi>();
  }
  if (!(groupId in readmodel.paperSnapshotRepresentatives)) {
    readmodel.paperSnapshotRepresentatives[groupId] = [];
  }
};

const hasIntersection = (
  paperSnapshot: EventOfType<'PaperSnapshotRecorded'>['expressionDois'],
  paperSnapshotRepresentatives: ReadModel['paperSnapshotRepresentatives'][GroupId],
) => {
  const intersection = Array.from(paperSnapshot).filter(
    (expressionDoi) => paperSnapshotRepresentatives.includes(expressionDoi),
  );
  return intersection.length > 0;
};

const handleEvaluationPublicationRecorded = (event: EventOfType<'EvaluationPublicationRecorded'>, readmodel: ReadModel) => {
  ensureGroupIdExists(readmodel, event.groupId);
  const isPartOfKnownSnapshot = Object.keys(readmodel.paperSnapshots).includes(event.articleId);
  if (!isPartOfKnownSnapshot) {
    readmodel.evaluatedExpressionsWithoutPaperSnapshot[event.groupId].add(event.articleId);
    return;
  }
  const latestSnapshotForEvaluatedExpression = new Set(readmodel.paperSnapshots[event.articleId]);
  const noExpressionOfThePaperIsInThePaperSnapshotRepresentativesForThatGroup = !hasIntersection(
    latestSnapshotForEvaluatedExpression,
    readmodel.paperSnapshotRepresentatives[event.groupId],
  );
  if (noExpressionOfThePaperIsInThePaperSnapshotRepresentativesForThatGroup) {
    readmodel.paperSnapshotRepresentatives[event.groupId].push(event.articleId);
  }
};

const updatePaperSnapshotRepresentatives = (
  paperSnapshotRepresentatives: ReadModel['paperSnapshotRepresentatives'][GroupId],
  paperExpressionDois: EventOfType<'PaperSnapshotRecorded'>['expressionDois'],
  queueOfExpressionsWithoutPaperSnapshot: ReadModel['evaluatedExpressionsWithoutPaperSnapshot'][GroupId],
) => {
  paperExpressionDois.forEach((paperExpressionDoi) => {
    const paperExpressionWasInQueue = queueOfExpressionsWithoutPaperSnapshot.delete(paperExpressionDoi);
    const noExpressionOfTheSnapshotIsInRepresentatives = !hasIntersection(
      paperExpressionDois,
      paperSnapshotRepresentatives,
    );
    if (paperExpressionWasInQueue && noExpressionOfTheSnapshotIsInRepresentatives) {
      paperSnapshotRepresentatives.push(paperExpressionDoi);
    }
  });
};

const handlePaperSnapshotRecorded = (event: EventOfType<'PaperSnapshotRecorded'>, readmodel: ReadModel) => {
  event.expressionDois.forEach((expression) => {
    readmodel.paperSnapshots[expression] = Array.from(event.expressionDois);
  });
  for (
    const [groupId, expressionsWithoutPaperSnapshot]
    of Object.entries(readmodel.evaluatedExpressionsWithoutPaperSnapshot)
  ) {
    ensureGroupIdExists(readmodel, groupId as GroupId);
    const paperSnapshotRepresentativesForGroup = readmodel.paperSnapshotRepresentatives[groupId as GroupId];
    updatePaperSnapshotRepresentatives(
      paperSnapshotRepresentativesForGroup,
      event.expressionDois,
      expressionsWithoutPaperSnapshot,
    );
  }
};

export const handleEvent = (
  consideredGroupIds: ReadonlyArray<GroupId>,
) => (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEventOfType('EvaluationPublicationRecorded')(event)) {
    if (consideredGroupIds.includes(event.groupId)) {
      handleEvaluationPublicationRecorded(event, readmodel);
    }
  }
  if (isEventOfType('PaperSnapshotRecorded')(event)) {
    handlePaperSnapshotRecorded(event, readmodel);
  }
  return readmodel;
};
