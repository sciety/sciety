/* eslint-disable no-param-reassign */
/* eslint-disable no-loops/no-loops */
import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
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
  evaluatedExpressionsWithoutPaperSnapshot: Record<GroupId, Set<ExpressionDoi>>,
  paperSnapshotsByEveryMember: Record<ExpressionDoi, PaperSnapshot>,
  deprecatedLastEvaluationOfExpressionPublishedAt: Record<ExpressionDoi, Date>,
  lastEvaluationOfExpressionPublishedAt: Map<ExpressionDoi, Date>,
};

export const initialState = (): ReadModel => ({
  evaluatedPapers: {},
  evaluatedExpressionsWithoutPaperSnapshot: {},
  paperSnapshotsByEveryMember: {},
  deprecatedLastEvaluationOfExpressionPublishedAt: {},
  lastEvaluationOfExpressionPublishedAt: new Map(),
});

const initialiseEvaluatedPapersForGroup = (readmodel: ReadModel, groupId: GroupId) => {
  if (!(groupId in readmodel.evaluatedPapers)) {
    readmodel.evaluatedPapers[groupId] = [];
  }
};

const allKnownRepresentatives = (readmodel: ReadModel, groupId: GroupId) => {
  initialiseEvaluatedPapersForGroup(readmodel, groupId);
  return pipe(
    readmodel.evaluatedPapers[groupId],
    RA.map((evaluatedPaper) => evaluatedPaper.representative),
    (representatives) => new Set(representatives),
  );
};

const declareEvaluatedPaper = (
  readmodel: ReadModel,
  groupId: GroupId,
  representative: ExpressionDoi,
  lastEvaluationPublishedAt: Date,
) => {
  initialiseEvaluatedPapersForGroup(readmodel, groupId);
  return readmodel.evaluatedPapers[groupId].push({
    representative,
    lastEvaluationPublishedAt,
  });
};

const hasIntersection = (
  paperSnapshot: PaperSnapshot,
  paperSnapshotRepresentatives: Set<PaperSnapshotRepresentative>,
) => {
  const intersection = paperSnapshot.filter(
    (expressionDoi) => paperSnapshotRepresentatives.has(expressionDoi),
  );
  return intersection.length > 0;
};

const pickRepresentative = (paperSnapshot: PaperSnapshot) => paperSnapshot[0];

const findRepresentativeByMember = (
  readmodel: ReadModel,
  snapshotMember: ExpressionDoi,
) => pickRepresentative(readmodel.paperSnapshotsByEveryMember[snapshotMember]);

const deprecatedCalculateLastEvaluationPublishedAtForSnapshot = (
  lastEvaluationOfExpressionPublishedAt: ReadModel['deprecatedLastEvaluationOfExpressionPublishedAt'],
  paperSnapshot: PaperSnapshot,
) => {
  let lastDate: Date = lastEvaluationOfExpressionPublishedAt[paperSnapshot[0]];
  paperSnapshot.forEach((expressionDoi) => {
    const expressionEvaluatedAt = lastEvaluationOfExpressionPublishedAt[expressionDoi];
    if (expressionEvaluatedAt > lastDate) {
      lastDate = expressionEvaluatedAt;
    }
  });
  return lastDate;
};

const updateLastEvaluationPublishedAtForKnownPaper = (
  readmodel: ReadModel,
  groupId: GroupId,
  paperRepresentative: ExpressionDoi,
) => {
  const evaluatedPapers = readmodel.evaluatedPapers[groupId];
  const indexOfExistingEvaluatedPaper = evaluatedPapers.findIndex(
    (evaluatedPaper) => evaluatedPaper.representative === paperRepresentative,
  );
  if (indexOfExistingEvaluatedPaper > -1) {
    const lastEvaluationPublishedAt = deprecatedCalculateLastEvaluationPublishedAtForSnapshot(
      readmodel.deprecatedLastEvaluationOfExpressionPublishedAt,
      readmodel.paperSnapshotsByEveryMember[paperRepresentative],
    );
    evaluatedPapers[indexOfExistingEvaluatedPaper].lastEvaluationPublishedAt = lastEvaluationPublishedAt;
  }
};

const updateLastEvaluationDate = (readmodel: ReadModel, event: EventOfType<'EvaluationPublicationRecorded'>) => {
  if (!(readmodel.deprecatedLastEvaluationOfExpressionPublishedAt[event.articleId])) {
    readmodel.deprecatedLastEvaluationOfExpressionPublishedAt[event.articleId] = event.publishedAt;
  } else if (event.publishedAt > readmodel.deprecatedLastEvaluationOfExpressionPublishedAt[event.articleId]) {
    readmodel.deprecatedLastEvaluationOfExpressionPublishedAt[event.articleId] = event.publishedAt;
  }

  const knownPublishedAt = readmodel.lastEvaluationOfExpressionPublishedAt.get(event.articleId);
  if (!(knownPublishedAt)) {
    readmodel.lastEvaluationOfExpressionPublishedAt.set(event.articleId, event.publishedAt);
  } else if (event.publishedAt > knownPublishedAt) {
    readmodel.lastEvaluationOfExpressionPublishedAt.set(event.articleId, event.publishedAt);
  }
};

const declareEvaluatedExpression = (readmodel: ReadModel, groupId: GroupId, expressionDoi: ExpressionDoi) => {
  if (!(groupId in readmodel.evaluatedExpressionsWithoutPaperSnapshot)) {
    readmodel.evaluatedExpressionsWithoutPaperSnapshot[groupId] = new Set();
  }
  readmodel.evaluatedExpressionsWithoutPaperSnapshot[groupId].add(expressionDoi);
};

const handleEvaluationPublicationRecorded = (event: EventOfType<'EvaluationPublicationRecorded'>, readmodel: ReadModel) => {
  updateLastEvaluationDate(readmodel, event);
  const isPartOfKnownSnapshot = Object.keys(readmodel.paperSnapshotsByEveryMember).includes(event.articleId);
  if (!isPartOfKnownSnapshot) {
    declareEvaluatedExpression(readmodel, event.groupId, event.articleId);
    return;
  }
  const latestSnapshotForEvaluatedExpression = readmodel.paperSnapshotsByEveryMember[event.articleId];
  const noExpressionOfThePaperIsInThePaperSnapshotRepresentativesForThatGroup = !hasIntersection(
    latestSnapshotForEvaluatedExpression,
    allKnownRepresentatives(readmodel, event.groupId),
  );
  if (noExpressionOfThePaperIsInThePaperSnapshotRepresentativesForThatGroup) {
    declareEvaluatedPaper(readmodel, event.groupId, event.articleId, event.publishedAt);
  } else {
    const evaluatedExpressionDoi = event.articleId;
    const paperRepresentative = findRepresentativeByMember(readmodel, evaluatedExpressionDoi);
    updateLastEvaluationPublishedAtForKnownPaper(readmodel, event.groupId, paperRepresentative);
  }
};

const updatePaperSnapshotRepresentatives = (
  readmodel: ReadModel,
  groupId: GroupId,
  paperSnapshot: PaperSnapshot,
  evaluatedExpressionsWithoutPaperSnapshot: ReadModel['evaluatedExpressionsWithoutPaperSnapshot'][GroupId],
) => {
  const lastEvaluationPublishedAt = deprecatedCalculateLastEvaluationPublishedAtForSnapshot(
    readmodel.deprecatedLastEvaluationOfExpressionPublishedAt,
    paperSnapshot,
  );
  paperSnapshot.forEach((expressionDoi) => {
    const evaluatedPaperExpressionWasNotAlreadyInSnapshot = evaluatedExpressionsWithoutPaperSnapshot.has(expressionDoi);
    const noExpressionOfTheSnapshotIsInRepresentatives = !hasIntersection(
      paperSnapshot,
      allKnownRepresentatives(readmodel, groupId),
    );
    if (evaluatedPaperExpressionWasNotAlreadyInSnapshot && noExpressionOfTheSnapshotIsInRepresentatives) {
      declareEvaluatedPaper(
        readmodel,
        groupId,
        expressionDoi,
        lastEvaluationPublishedAt,
      );
    }
    evaluatedExpressionsWithoutPaperSnapshot.delete(expressionDoi);
  });
  const paperRepresentative = pickRepresentative(paperSnapshot);
  updateLastEvaluationPublishedAtForKnownPaper(readmodel, groupId, paperRepresentative);
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
