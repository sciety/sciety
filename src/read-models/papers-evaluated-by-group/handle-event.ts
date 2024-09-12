/* eslint-disable no-param-reassign */
/* eslint-disable no-loops/no-loops */
import * as R from 'fp-ts/Record';
import { DomainEvent, EventOfType, isEventOfType } from '../../domain-events';
import { ExpressionDoi } from '../../types/expression-doi';
import { GroupId } from '../../types/group-id';

type PaperSnapshotRepresentative = ExpressionDoi;

type PaperSnapshot = EventOfType<'PaperSnapshotRecorded'>['expressionDois'];

export type EvaluatedPaper = {
  representative: ExpressionDoi,
  lastEvaluationPublishedAt: Date,
};

export type ReadModel = {
  evaluatedPapers: Record<GroupId, Array<EvaluatedPaper>>,
  paperSnapshotRepresentatives: Record<GroupId, Set<PaperSnapshotRepresentative>>,
  evaluatedExpressionsWithoutPaperSnapshot: Record<GroupId, Set<ExpressionDoi>>,
  paperSnapshotsByEveryMember: Record<ExpressionDoi, PaperSnapshot>,
};

export const initialState = (): ReadModel => ({
  evaluatedPapers: {},
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
  if (!(groupId in readmodel.evaluatedPapers)) {
    readmodel.evaluatedPapers[groupId] = [];
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

const updateLastEvaluationPublishedAtForAKnownExpression = (event: EventOfType<'EvaluationPublicationRecorded'>, readmodel: ReadModel) => {
  const evaluatedPapers = readmodel.evaluatedPapers[event.groupId];
  const indexOfExistingEvaluatedPaper = evaluatedPapers.findIndex(
    (evaluatedPaper) => evaluatedPaper.representative === event.articleId,
  );
  if (indexOfExistingEvaluatedPaper > -1) {
    evaluatedPapers[indexOfExistingEvaluatedPaper].lastEvaluationPublishedAt = event.publishedAt;
  }
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
    readmodel.evaluatedPapers[event.groupId].push({
      representative: event.articleId,
      lastEvaluationPublishedAt: event.publishedAt,
    });
  } else {
    updateLastEvaluationPublishedAtForAKnownExpression(event, readmodel);
  }
};

const updatePaperSnapshotRepresentatives = (
  readmodel: ReadModel,
  groupId: GroupId,
  paperSnapshot: PaperSnapshot,
  queueOfExpressionsWithoutPaperSnapshot: ReadModel['evaluatedExpressionsWithoutPaperSnapshot'][GroupId],
) => {
  paperSnapshot.forEach((expressionDoi) => {
    const paperExpressionWasInQueue = queueOfExpressionsWithoutPaperSnapshot.delete(expressionDoi);
    const noExpressionOfTheSnapshotIsInRepresentatives = !hasIntersection(
      paperSnapshot,
      readmodel.paperSnapshotRepresentatives[groupId],
    );
    if (paperExpressionWasInQueue && noExpressionOfTheSnapshotIsInRepresentatives) {
      readmodel.paperSnapshotRepresentatives[groupId].add(expressionDoi);
      readmodel.evaluatedPapers[groupId].push({
        representative: expressionDoi,
        lastEvaluationPublishedAt: new Date(),
      });
    }
  });
};

const handlePaperSnapshotRecorded = (event: EventOfType<'PaperSnapshotRecorded'>, readmodel: ReadModel) => {
  event.expressionDois.forEach((member) => {
    readmodel.paperSnapshotsByEveryMember[member] = event.expressionDois;
  });
  for (
    const [groupId, expressionsWithoutPaperSnapshot]
    of R.toEntries(readmodel.evaluatedExpressionsWithoutPaperSnapshot)
  ) {
    ensureGroupIdExists(readmodel, groupId);
    updatePaperSnapshotRepresentatives(readmodel, groupId, event.expressionDois, expressionsWithoutPaperSnapshot);
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
