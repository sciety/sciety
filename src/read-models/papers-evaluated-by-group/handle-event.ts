/* eslint-disable no-param-reassign */
/* eslint-disable no-loops/no-loops */
import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { DomainEvent, EventOfType, isEventOfType } from '../../domain-events';
import { Logger } from '../../logger';
import { ExpressionDoi } from '../../types/expression-doi';
import { GroupId } from '../../types/group-id';

const intersection = <T>(
  set1: ReadonlySet<T>,
) => (set2: ReadonlySet<T>): Set<T> => new Set([...set2].filter((value) => set1.has(value)));

type PaperSnapshotRepresentative = ExpressionDoi;

type PaperSnapshot = ReadonlyArray<ExpressionDoi>;

export type EvaluatedPaper = {
  representative: PaperSnapshotRepresentative,
  lastEvaluatedAt: Date,
};

export type ReadModel = {
  evaluatedPapers: Record<GroupId, Array<EvaluatedPaper>>,
  // Expressions that have been evaluated by a certain group, but are not covered by paperSnapshotsByEveryMember
  pendingExpressions: Record<GroupId, Set<ExpressionDoi>>,
  paperSnapshotsByEveryMember: Record<ExpressionDoi, PaperSnapshot>,
  expressionLastEvaluatedAt: Map<GroupId, Map<ExpressionDoi, Date>>,
};

type EvaluatedExpression = {
  groupId: GroupId,
  expressionDoi: ExpressionDoi,
};

export const initialState = (): ReadModel => ({
  evaluatedPapers: {},
  pendingExpressions: {},
  paperSnapshotsByEveryMember: {},
  expressionLastEvaluatedAt: new Map(),
});

const initialiseEvaluatedPapersForGroup = (readmodel: ReadModel, groupId: GroupId) => {
  if (!(groupId in readmodel.evaluatedPapers)) {
    readmodel.evaluatedPapers[groupId] = [];
  }
};

const calculateLastEvaluatedAtForSnapshot = (
  readmodel: ReadModel,
  groupId: GroupId,
  paperSnapshot: PaperSnapshot,
): Date | undefined => {
  let calculatedDate: Date | undefined;
  const expressionLastEvaluatedAtForGroup = readmodel.expressionLastEvaluatedAt.get(groupId);
  if (expressionLastEvaluatedAtForGroup === undefined) {
    return undefined;
  }
  paperSnapshot.forEach((expressionDoi) => {
    const expressionLastEvaluatedAt = expressionLastEvaluatedAtForGroup.get(expressionDoi);
    if (expressionLastEvaluatedAt === undefined) {
      return;
    }
    if (calculatedDate === undefined) {
      calculatedDate = expressionLastEvaluatedAt;
      return;
    }
    if (expressionLastEvaluatedAt > calculatedDate) {
      calculatedDate = expressionLastEvaluatedAt;
    }
  });
  return calculatedDate;
};

const updateLastEvaluationDate = (
  expressionLastEvaluatedAt: ReadModel['expressionLastEvaluatedAt'],
  event: EventOfType<'EvaluationPublicationRecorded'>,
) => {
  let expressionLastEvaluatedAtForGroup = expressionLastEvaluatedAt.get(event.groupId);
  if (expressionLastEvaluatedAtForGroup === undefined) {
    expressionLastEvaluatedAtForGroup = new Map();
    expressionLastEvaluatedAt.set(event.groupId, expressionLastEvaluatedAtForGroup);
  }

  const knownPublishedAt = expressionLastEvaluatedAtForGroup.get(event.articleId);
  if (!(knownPublishedAt)) {
    expressionLastEvaluatedAtForGroup.set(event.articleId, event.publishedAt);
  } else if (event.publishedAt > knownPublishedAt) {
    expressionLastEvaluatedAtForGroup.set(event.articleId, event.publishedAt);
  }
};

const addPendingExpression = (readmodel: ReadModel, pending: EvaluatedExpression) => {
  if (!(pending.groupId in readmodel.pendingExpressions)) {
    readmodel.pendingExpressions[pending.groupId] = new Set();
  }
  readmodel.pendingExpressions[pending.groupId].add(pending.expressionDoi);
};

const upsertEvaluatedPaper = (
  logger: Logger,
  readmodel: ReadModel,
) => (
  ready: EvaluatedExpression,
) => {
  const groupId = ready.groupId;
  initialiseEvaluatedPapersForGroup(readmodel, groupId);
  const papersEvaluatedByGroup = readmodel.evaluatedPapers[groupId];
  const latestSnapshotForEvaluatedExpression = readmodel.paperSnapshotsByEveryMember[ready.expressionDoi];
  const dateOfLatestEvaluationByGroup = calculateLastEvaluatedAtForSnapshot(
    readmodel, groupId, latestSnapshotForEvaluatedExpression,
  );

  if (dateOfLatestEvaluationByGroup === undefined) {
    logger('error', 'Unreachable state in papers-evaluated-by-group read model', { ready });
    return;
  }

  for (const evaluatedPaper of papersEvaluatedByGroup) {
    if (latestSnapshotForEvaluatedExpression.includes(evaluatedPaper.representative)) {
      evaluatedPaper.lastEvaluatedAt = dateOfLatestEvaluationByGroup;
      return;
    }
  }

  papersEvaluatedByGroup.push({
    lastEvaluatedAt: dateOfLatestEvaluationByGroup,
    representative: Array.from(latestSnapshotForEvaluatedExpression).sort()[0],
  });
};

const handleEvaluationPublicationRecorded = (logger: Logger, event: EventOfType<'EvaluationPublicationRecorded'>, readmodel: ReadModel) => {
  // Keep track of evaluation dates in private part of read model (not used directy by queries)
  updateLastEvaluationDate(readmodel.expressionLastEvaluatedAt, event);
  const evaluatedExpression: EvaluatedExpression = {
    expressionDoi: event.articleId,
    groupId: event.groupId,
  };

  // We only attempt to update evaluatedPapers if we have snapshot information for the evaluated expression
  const isPartOfKnownSnapshot = Object.keys(readmodel.paperSnapshotsByEveryMember)
    .includes(evaluatedExpression.expressionDoi);
  if (!isPartOfKnownSnapshot) {
    addPendingExpression(readmodel, evaluatedExpression);
    return;
  }

  upsertEvaluatedPaper(logger, readmodel)(evaluatedExpression);
};

const updateKnownPaperSnapshots = (
  paperSnapshotsByEveryMember: ReadModel['paperSnapshotsByEveryMember'],
  snapshotExpressionDois: EventOfType<'PaperSnapshotRecorded'>['expressionDois'],
) => {
  const paperSnapshot = Array.from(snapshotExpressionDois);
  snapshotExpressionDois.forEach((snapshotMember) => {
    paperSnapshotsByEveryMember[snapshotMember] = paperSnapshot;
  });
};

const flattenToArray = (pendingExpressionsInSnapshot: ReadModel['pendingExpressions']) => pipe(
  pendingExpressionsInSnapshot,
  R.toEntries,
  RA.flatMap(([groupId, expressionDois]) => pipe(
    Array.from(expressionDois),
    RA.map((expressionDoi) => ({ expressionDoi, groupId })),
  )),
);

const identifyReadyExpression = (pendingExpressions: ReadModel['pendingExpressions'], snapshotMembers: ReadonlySet<ExpressionDoi>) => pipe(
  pendingExpressions,
  R.map(intersection(snapshotMembers)),
  flattenToArray,
);

const removeFrom = (pendingExpressions: ReadModel['pendingExpressions']) => (evaluatedExpression: EvaluatedExpression) => {
  pendingExpressions[evaluatedExpression.groupId].delete(evaluatedExpression.expressionDoi);
};

const handlePaperSnapshotRecorded = (logger: Logger, event: EventOfType<'PaperSnapshotRecorded'>, readmodel: ReadModel) => {
  const snapshotMembers = event.expressionDois;
  updateKnownPaperSnapshots(readmodel.paperSnapshotsByEveryMember, snapshotMembers);

  const readyExpressions = identifyReadyExpression(readmodel.pendingExpressions, snapshotMembers);
  readyExpressions.forEach(removeFrom(readmodel.pendingExpressions));

  readyExpressions.forEach(upsertEvaluatedPaper(logger, readmodel));
};

export const handleEvent = (
  logger: Logger,
  consideredGroupIds: ReadonlyArray<GroupId>,
) => (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEventOfType('EvaluationPublicationRecorded')(event)) {
    if (consideredGroupIds.includes(event.groupId)) {
      handleEvaluationPublicationRecorded(logger, event, readmodel);
    }
  }
  if (isEventOfType('PaperSnapshotRecorded')(event)) {
    handlePaperSnapshotRecorded(logger, event, readmodel);
  }
  return readmodel;
};
