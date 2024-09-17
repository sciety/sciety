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
  representative: PaperSnapshotRepresentative,
  lastEvaluatedAt: Date,
};

export type ReadModel = {
  evaluatedPapers: Record<GroupId, Array<EvaluatedPaper>>,
  evaluatedExpressionsWithoutPaperSnapshot: Record<GroupId, Set<ExpressionDoi>>,
  paperSnapshotsByEveryMember: Record<ExpressionDoi, PaperSnapshot>,
  deprecatedExpressionLastEvaluatedAt: Record<ExpressionDoi, Date>,
  expressionLastEvaluatedAt: Map<ExpressionDoi, Date>,
};

export const initialState = (): ReadModel => ({
  evaluatedPapers: {},
  evaluatedExpressionsWithoutPaperSnapshot: {},
  paperSnapshotsByEveryMember: {},
  deprecatedExpressionLastEvaluatedAt: {},
  expressionLastEvaluatedAt: new Map(),
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
  representative: PaperSnapshotRepresentative,
  lastEvaluatedAt: Date,
) => {
  initialiseEvaluatedPapersForGroup(readmodel, groupId);
  return readmodel.evaluatedPapers[groupId].push({
    representative,
    lastEvaluatedAt,
  });
};

const pickRepresentative = (paperSnapshot: PaperSnapshot): PaperSnapshotRepresentative => paperSnapshot[0];

const findRepresentativeByMember = (
  readmodel: ReadModel,
  snapshotMember: ExpressionDoi,
): PaperSnapshotRepresentative => pickRepresentative(readmodel.paperSnapshotsByEveryMember[snapshotMember]);

const calculateLastEvaluatedAtForSnapshot = (
  readmodel: ReadModel,
  paperSnapshot: PaperSnapshot,
): Date | undefined => {
  let calculatedDate: Date | undefined = readmodel.expressionLastEvaluatedAt.get(paperSnapshot[0]);
  paperSnapshot.forEach((expressionDoi) => {
    const expressionLastEvaluatedAt = readmodel.expressionLastEvaluatedAt.get(expressionDoi);
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

const updateLastEvaluatedAtForKnownPaper = (
  readmodel: ReadModel,
  groupId: GroupId,
  paperSnapshotRepresentative: PaperSnapshotRepresentative,
) => {
  const evaluatedPapers = readmodel.evaluatedPapers[groupId];
  const indexOfExistingEvaluatedPaper = evaluatedPapers.findIndex(
    (evaluatedPaper) => evaluatedPaper.representative === paperSnapshotRepresentative,
  );
  if (indexOfExistingEvaluatedPaper > -1) {
    const lastEvaluatedAt = calculateLastEvaluatedAtForSnapshot(
      readmodel,
      readmodel.paperSnapshotsByEveryMember[paperSnapshotRepresentative],
    );
    if (lastEvaluatedAt !== undefined) {
      evaluatedPapers[indexOfExistingEvaluatedPaper].lastEvaluatedAt = lastEvaluatedAt;
    }
  }
};

const updateLastEvaluationDate = (readmodel: ReadModel, event: EventOfType<'EvaluationPublicationRecorded'>) => {
  if (!(readmodel.deprecatedExpressionLastEvaluatedAt[event.articleId])) {
    readmodel.deprecatedExpressionLastEvaluatedAt[event.articleId] = event.publishedAt;
  } else if (event.publishedAt > readmodel.deprecatedExpressionLastEvaluatedAt[event.articleId]) {
    readmodel.deprecatedExpressionLastEvaluatedAt[event.articleId] = event.publishedAt;
  }

  const knownPublishedAt = readmodel.expressionLastEvaluatedAt.get(event.articleId);
  if (!(knownPublishedAt)) {
    readmodel.expressionLastEvaluatedAt.set(event.articleId, event.publishedAt);
  } else if (event.publishedAt > knownPublishedAt) {
    readmodel.expressionLastEvaluatedAt.set(event.articleId, event.publishedAt);
  }
};

const declareEvaluatedExpression = (readmodel: ReadModel, groupId: GroupId, expressionDoi: ExpressionDoi) => {
  if (!(groupId in readmodel.evaluatedExpressionsWithoutPaperSnapshot)) {
    readmodel.evaluatedExpressionsWithoutPaperSnapshot[groupId] = new Set();
  }
  readmodel.evaluatedExpressionsWithoutPaperSnapshot[groupId].add(expressionDoi);
};

const isSnapshotRepresented = (
  readmodel: ReadModel,
  groupId: GroupId,
  paperSnapshot: PaperSnapshot,
) => allKnownRepresentatives(readmodel, groupId).has(pickRepresentative(paperSnapshot));

const handleEvaluationPublicationRecorded = (event: EventOfType<'EvaluationPublicationRecorded'>, readmodel: ReadModel) => {
  updateLastEvaluationDate(readmodel, event);
  const isPartOfKnownSnapshot = Object.keys(readmodel.paperSnapshotsByEveryMember).includes(event.articleId);
  if (!isPartOfKnownSnapshot) {
    declareEvaluatedExpression(readmodel, event.groupId, event.articleId);
    return;
  }
  const latestSnapshotForEvaluatedExpression = readmodel.paperSnapshotsByEveryMember[event.articleId];
  if (!isSnapshotRepresented(readmodel, event.groupId, latestSnapshotForEvaluatedExpression)) {
    const paperSnapshotRepresentative = pickRepresentative(latestSnapshotForEvaluatedExpression);
    declareEvaluatedPaper(
      readmodel,
      event.groupId,
      paperSnapshotRepresentative,
      event.publishedAt,
    );
  } else {
    const evaluatedExpressionDoi = event.articleId;
    const paperSnapshotRepresentative = findRepresentativeByMember(readmodel, evaluatedExpressionDoi);
    updateLastEvaluatedAtForKnownPaper(readmodel, event.groupId, paperSnapshotRepresentative);
  }
};

const updatePaperSnapshotRepresentatives = (
  readmodel: ReadModel,
  groupId: GroupId,
  paperSnapshot: PaperSnapshot,
  evaluatedExpressionsWithoutPaperSnapshot: ReadModel['evaluatedExpressionsWithoutPaperSnapshot'][GroupId],
) => {
  const lastEvaluatedAt = calculateLastEvaluatedAtForSnapshot(
    readmodel,
    paperSnapshot,
  );
  const paperSnapshotRepresentative = pickRepresentative(paperSnapshot);
  paperSnapshot.forEach((expressionDoi) => {
    const evaluatedPaperExpressionWasNotAlreadyInSnapshot = evaluatedExpressionsWithoutPaperSnapshot.has(expressionDoi);
    if (evaluatedPaperExpressionWasNotAlreadyInSnapshot
      && !isSnapshotRepresented(readmodel, groupId, paperSnapshot)
      && lastEvaluatedAt !== undefined
    ) {
      declareEvaluatedPaper(
        readmodel,
        groupId,
        paperSnapshotRepresentative,
        lastEvaluatedAt,
      );
    }
    evaluatedExpressionsWithoutPaperSnapshot.delete(expressionDoi);
  });
  updateLastEvaluatedAtForKnownPaper(readmodel, groupId, paperSnapshotRepresentative);
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
