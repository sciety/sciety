/* eslint-disable no-param-reassign */
/* eslint-disable no-loops/no-loops */
import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { DomainEvent, EventOfType, isEventOfType } from '../../domain-events';
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
  evaluatedExpressionsWithoutPaperSnapshot: Record<GroupId, Set<ExpressionDoi>>, // why is this by GroupId?
  paperSnapshotsByEveryMember: Record<ExpressionDoi, PaperSnapshot>,
  expressionLastEvaluatedAt: Map<GroupId, Map<ExpressionDoi, Date>>,
};

export const initialState = (): ReadModel => ({
  evaluatedPapers: {},
  evaluatedExpressionsWithoutPaperSnapshot: {},
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

const addToExpressionsWithoutSnapshot = (readmodel: ReadModel, groupId: GroupId, expressionDoi: ExpressionDoi) => {
  if (!(groupId in readmodel.evaluatedExpressionsWithoutPaperSnapshot)) {
    readmodel.evaluatedExpressionsWithoutPaperSnapshot[groupId] = new Set();
  }
  readmodel.evaluatedExpressionsWithoutPaperSnapshot[groupId].add(expressionDoi);
};

const updateEvaluatedPapers = (
  readmodel: ReadModel,
  groupId: GroupId,
  latestSnapshot: PaperSnapshot,
  dateOfLatestEvalution: Date,
) => {
  initialiseEvaluatedPapersForGroup(readmodel, groupId);
  const papersEvaluatedByGroup = readmodel.evaluatedPapers[groupId];

  for (const evaluatedPaper of papersEvaluatedByGroup) {
    if (latestSnapshot.includes(evaluatedPaper.representative)) {
      evaluatedPaper.lastEvaluatedAt = dateOfLatestEvalution;
      return;
    }
  }

  papersEvaluatedByGroup.push({
    lastEvaluatedAt: dateOfLatestEvalution,
    representative: latestSnapshot[0],
  });
};

const handleEvaluationPublicationRecorded = (event: EventOfType<'EvaluationPublicationRecorded'>, readmodel: ReadModel) => {
  // Keep track of evaluation dates in private part of read model (not used directy by queries)
  updateLastEvaluationDate(readmodel.expressionLastEvaluatedAt, event);

  // We only attempt to update evaluatedPapers if we have snapshot information for the evaluated expression
  const isPartOfKnownSnapshot = Object.keys(readmodel.paperSnapshotsByEveryMember).includes(event.articleId);
  if (!isPartOfKnownSnapshot) {
    addToExpressionsWithoutSnapshot(readmodel, event.groupId, event.articleId);
    return;
  }

  // Now the readmodel has all information needed to update evaluated papers
  const latestSnapshotForEvaluatedExpression = readmodel.paperSnapshotsByEveryMember[event.articleId];
  const dateOfLatestEvalutionByGroup = calculateLastEvaluatedAtForSnapshot(
    readmodel, event.groupId, latestSnapshotForEvaluatedExpression,
  ) ?? event.publishedAt; // fallback needed due to types

  updateEvaluatedPapers(
    readmodel,
    event.groupId,
    latestSnapshotForEvaluatedExpression,
    dateOfLatestEvalutionByGroup,
  );
};

const handlePaperSnapshotRecorded = (event: EventOfType<'PaperSnapshotRecorded'>, readmodel: ReadModel) => {
  // Keep track of latest snapshot information available for each expression
  const paperSnapshot = Array.from(event.expressionDois);
  event.expressionDois.forEach((snapshotMember) => {
    readmodel.paperSnapshotsByEveryMember[snapshotMember] = paperSnapshot;
  });

  const evaluatedExpressionCoveredByNewSnapshot = pipe(
    readmodel.evaluatedExpressionsWithoutPaperSnapshot,
    R.map(intersection(event.expressionDois)),
    R.toEntries,
    RA.flatMap(([groupId, expressionDois]) => pipe(
      Array.from(expressionDois),
      RA.map((expressionDoi) => ({ expressionDoi, groupId })),
    )),
  );

  // Loop over all evaluated expressions for which we previously had no snapshots
  for (const item of evaluatedExpressionCoveredByNewSnapshot) {
    const latestSnapshotForEvaluatedExpression = readmodel.paperSnapshotsByEveryMember[item.expressionDoi];

    const dateOfLatestEvalutionByGroup = calculateLastEvaluatedAtForSnapshot(
      readmodel, item.groupId, latestSnapshotForEvaluatedExpression,
    ) ?? new Date(); // fallback needed due to types
    updateEvaluatedPapers(
      readmodel,
      item.groupId,
      latestSnapshotForEvaluatedExpression,
      dateOfLatestEvalutionByGroup,
    );
  }

  // Remove all expression from queue of missing snapshots for which we now have a snapshot
  event.expressionDois.forEach((snapshotMember) => {
    Object.values(readmodel.evaluatedExpressionsWithoutPaperSnapshot)
      .forEach((expressions) => { expressions.delete(snapshotMember); });
  });
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
