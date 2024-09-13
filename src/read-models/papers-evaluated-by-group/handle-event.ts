/* eslint-disable no-param-reassign */
/* eslint-disable no-loops/no-loops */
import * as R from 'fp-ts/Record';
import { DomainEvent, EventOfType, isEventOfType } from '../../domain-events';
import { ExpressionDoi } from '../../types/expression-doi';
import { GroupId } from '../../types/group-id';

type PaperSnapshotRepresentative = ExpressionDoi;

type PaperSnapshot = ReadonlyArray<ExpressionDoi>;

export type EvaluatedPaper = {
  representative: ExpressionDoi,
  lastEvaluationPublishedAt: Date,
};

export type ReadModel = {
  evaluatedPapers: Record<GroupId, Array<EvaluatedPaper>>,
  paperSnapshotRepresentatives: Record<GroupId, Set<PaperSnapshotRepresentative>>,
  evaluatedExpressionsWithoutPaperSnapshot: Record<GroupId, Set<ExpressionDoi>>,
  paperSnapshotsByEveryMember: Record<ExpressionDoi, PaperSnapshot>,
  lastEvaluationOfExpressionPublishedAt: Record<ExpressionDoi, Date>,
};

export const initialState = (): ReadModel => ({
  evaluatedPapers: {},
  paperSnapshotRepresentatives: {},
  evaluatedExpressionsWithoutPaperSnapshot: {},
  paperSnapshotsByEveryMember: {},
  lastEvaluationOfExpressionPublishedAt: {},
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
  const intersection = paperSnapshot.filter(
    (expressionDoi) => paperSnapshotRepresentatives.has(expressionDoi),
  );
  return intersection.length > 0;
};

const findRepresentative = (
  readmodel: ReadModel,
  snapshotMember: ExpressionDoi,
) => readmodel.paperSnapshotsByEveryMember[snapshotMember][0];

const updateLastEvaluationPublishedAtForKnownPaper = (event: EventOfType<'EvaluationPublicationRecorded'>, readmodel: ReadModel) => {
  const evaluatedPapers = readmodel.evaluatedPapers[event.groupId];
  const evaluatedExpressionDoi = event.articleId;
  const paperRepresentative = findRepresentative(readmodel, evaluatedExpressionDoi);
  const indexOfExistingEvaluatedPaper = evaluatedPapers.findIndex(
    (evaluatedPaper) => evaluatedPaper.representative === paperRepresentative,
  );
  if (indexOfExistingEvaluatedPaper > -1) {
    if (event.publishedAt > evaluatedPapers[indexOfExistingEvaluatedPaper].lastEvaluationPublishedAt) {
      evaluatedPapers[indexOfExistingEvaluatedPaper].lastEvaluationPublishedAt = event.publishedAt;
    }
  }
};

const chooseRepresentative = (paperSnapshotRepresentativesForGroup: ReadModel['paperSnapshotRepresentatives'][GroupId], representative: ExpressionDoi) => paperSnapshotRepresentativesForGroup.add(representative);

const declareEvaluatedPaper = (
  evaluatedPapersForGroup: ReadModel['evaluatedPapers'][GroupId],
  representative: ExpressionDoi,
  lastEvaluationPublishedAt: Date,
) => evaluatedPapersForGroup.push({
  representative,
  lastEvaluationPublishedAt,
});

const chooseRepresentativeAndDeclareEvaluatedPaper = (
  readmodel: ReadModel,
  groupId: GroupId,
  representative: ExpressionDoi,
  lastEvaluationPublishedAt: Date,
) => {
  chooseRepresentative(readmodel.paperSnapshotRepresentatives[groupId], representative);
  declareEvaluatedPaper(readmodel.evaluatedPapers[groupId], representative, lastEvaluationPublishedAt);
};

const updateLastEvaluationDate = (readmodel: ReadModel, event: EventOfType<'EvaluationPublicationRecorded'>) => {
  if (!(readmodel.lastEvaluationOfExpressionPublishedAt[event.articleId])) {
    readmodel.lastEvaluationOfExpressionPublishedAt[event.articleId] = event.publishedAt;
  } else if (event.publishedAt > readmodel.lastEvaluationOfExpressionPublishedAt[event.articleId]) {
    readmodel.lastEvaluationOfExpressionPublishedAt[event.articleId] = event.publishedAt;
  }
};

const handleEvaluationPublicationRecorded = (event: EventOfType<'EvaluationPublicationRecorded'>, readmodel: ReadModel) => {
  updateLastEvaluationDate(readmodel, event);
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
    chooseRepresentativeAndDeclareEvaluatedPaper(readmodel, event.groupId, event.articleId, event.publishedAt);
  } else {
    updateLastEvaluationPublishedAtForKnownPaper(event, readmodel);
  }
};

const updatePaperSnapshotRepresentatives = (
  readmodel: ReadModel,
  groupId: GroupId,
  paperSnapshot: PaperSnapshot,
  evaluatedExpressionsWithoutPaperSnapshot: ReadModel['evaluatedExpressionsWithoutPaperSnapshot'][GroupId],
) => {
  paperSnapshot.forEach((expressionDoi) => {
    const evaluatedPaperExpressionWasNotAlreadyInSnapshot = evaluatedExpressionsWithoutPaperSnapshot.has(expressionDoi);
    const noExpressionOfTheSnapshotIsInRepresentatives = !hasIntersection(
      paperSnapshot,
      readmodel.paperSnapshotRepresentatives[groupId],
    );
    if (evaluatedPaperExpressionWasNotAlreadyInSnapshot && noExpressionOfTheSnapshotIsInRepresentatives) {
      chooseRepresentativeAndDeclareEvaluatedPaper(readmodel, groupId, expressionDoi, new Date('1900-01-01'));
    }
    evaluatedExpressionsWithoutPaperSnapshot.delete(expressionDoi);
  });
};

const handlePaperSnapshotRecorded = (event: EventOfType<'PaperSnapshotRecorded'>, readmodel: ReadModel) => {
  const paperSnapshot = Array.from(event.expressionDois);
  event.expressionDois.forEach((member) => {
    readmodel.paperSnapshotsByEveryMember[member] = paperSnapshot;
  });
  for (
    const [groupId, expressionsWithoutPaperSnapshot]
    of R.toEntries(readmodel.evaluatedExpressionsWithoutPaperSnapshot)
  ) {
    ensureGroupIdExists(readmodel, groupId);
    updatePaperSnapshotRepresentatives(
      readmodel,
      groupId,
      paperSnapshot,
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
