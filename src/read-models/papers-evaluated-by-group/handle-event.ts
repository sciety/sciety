/* eslint-disable no-param-reassign */
/* eslint-disable no-loops/no-loops */
import { DomainEvent, EventOfType, isEventOfType } from '../../domain-events';
import { ExpressionDoi } from '../../types/expression-doi';
import { GroupId } from '../../types/group-id';

type PaperSnapshotRepresentative = ExpressionDoi;

type PaperSnapshot = EventOfType<'PaperSnapshotRecorded'>['expressionDois'];

export type ReadModel = {
  paperSnapshotRepresentatives: Record<GroupId, Set<PaperSnapshotRepresentative>>,
  evaluatedExpressionsWithoutPaperSnapshot: Record<GroupId, Set<ExpressionDoi>>,
  paperSnapshotsByEveryMember: Record<ExpressionDoi, PaperSnapshot>,
};

export const initialState = (): ReadModel => ({
  paperSnapshotRepresentatives: {},
  evaluatedExpressionsWithoutPaperSnapshot: {},
  paperSnapshotsByEveryMember: {},
});

const ensureGroupIdExists = (readmodel: ReadModel, groupId: GroupId) => {
  if (!(groupId in readmodel.evaluatedExpressionsWithoutPaperSnapshot)) {
    readmodel.evaluatedExpressionsWithoutPaperSnapshot[groupId] = new Set();
  }
  if (!(groupId in readmodel.paperSnapshotRepresentatives)) {
    readmodel.paperSnapshotRepresentatives[groupId] = new Set();
  }
};

const hasIntersection = (
  paperSnapshot: PaperSnapshot,
  paperSnapshotRepresentatives: ReadModel['paperSnapshotRepresentatives'][GroupId],
) => {
  const intersection = Array.from(paperSnapshot).filter(
    (expressionDoi) => paperSnapshotRepresentatives.has(expressionDoi),
  );
  return intersection.length > 0;
};

const handleEvaluationPublicationRecorded = (event: EventOfType<'EvaluationPublicationRecorded'>, readmodel: ReadModel) => {
  ensureGroupIdExists(readmodel, event.groupId);
  const isPartOfKnownSnapshot = Object.keys(readmodel.paperSnapshotsByEveryMember).includes(event.articleId);
  if (!isPartOfKnownSnapshot) {
    readmodel.evaluatedExpressionsWithoutPaperSnapshot[event.groupId].add(event.articleId);
    return;
  }
  const latestSnapshotForEvaluatedExpression = readmodel.paperSnapshotsByEveryMember[event.articleId];
  const noExpressionOfThePaperIsInThePaperSnapshotRepresentativesForThatGroup = !hasIntersection(
    latestSnapshotForEvaluatedExpression,
    readmodel.paperSnapshotRepresentatives[event.groupId],
  );
  if (noExpressionOfThePaperIsInThePaperSnapshotRepresentativesForThatGroup) {
    readmodel.paperSnapshotRepresentatives[event.groupId].add(event.articleId);
  }
};

const updatePaperSnapshotRepresentatives = (
  paperSnapshotRepresentatives: ReadModel['paperSnapshotRepresentatives'][GroupId],
  paperSnapshot: PaperSnapshot,
  queueOfExpressionsWithoutPaperSnapshot: ReadModel['evaluatedExpressionsWithoutPaperSnapshot'][GroupId],
) => {
  paperSnapshot.forEach((expressionDoi) => {
    const paperExpressionWasInQueue = queueOfExpressionsWithoutPaperSnapshot.delete(expressionDoi);
    const noExpressionOfTheSnapshotIsInRepresentatives = !hasIntersection(
      paperSnapshot,
      paperSnapshotRepresentatives,
    );
    if (paperExpressionWasInQueue && noExpressionOfTheSnapshotIsInRepresentatives) {
      paperSnapshotRepresentatives.add(expressionDoi);
    }
  });
};

const handlePaperSnapshotRecorded = (event: EventOfType<'PaperSnapshotRecorded'>, readmodel: ReadModel) => {
  event.expressionDois.forEach((member) => {
    readmodel.paperSnapshotsByEveryMember[member] = event.expressionDois;
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
