/* eslint-disable jest/expect-expect */
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent, EventOfType } from '../../../src/domain-events';
import {
  getPapersEvaluatedByGroup,
} from '../../../src/read-models/papers-evaluated-by-group/get-papers-evaluated-by-group';
import { initialState, handleEvent, EvaluatedPaper } from '../../../src/read-models/papers-evaluated-by-group/handle-event';
import { ExpressionDoi } from '../../../src/types/expression-doi';
import { fromValidatedString, GroupId } from '../../../src/types/group-id';
import { arbitraryPaperSnapshotRecordedEvent } from '../../domain-events/arbitrary-paper-snapshot-event.helper';
import { arbitraryEvaluationPublicationRecordedEvent } from '../../domain-events/evaluation-resource-events.helper';
import { dummyLogger } from '../../dummy-logger';
import { arbitraryOrderSet } from '../../helpers';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';

const groupId = arbitraryGroupId();
const anotherGroupId = arbitraryGroupId();
const consideredGroupIds = [groupId, anotherGroupId, fromValidatedString('4d6a8908-22a9-45c8-bd56-3c7140647709')];

const someTimeAfter = (date: Date) => {
  const later = new Date(date);
  later.setFullYear(date.getFullYear() + 1);
  return later;
};

const someTimeBefore = (date: Date) => {
  const later = new Date(date);
  later.setFullYear(date.getFullYear() - 1);
  return later;
};

const runQuery = (events: ReadonlyArray<DomainEvent>, queriedGroupId: GroupId) => {
  const readModel = pipe(
    events,
    RA.reduce(initialState(), handleEvent(dummyLogger, consideredGroupIds)),
  );
  return getPapersEvaluatedByGroup(readModel)(queriedGroupId);
};

const expectDeterministicSingleExpressionDoiFromSnapshot = (
  result: ReadonlySet<EvaluatedPaper>,
  snapshot: ReadonlySet<ExpressionDoi>,
) => {
  expect(result.size).toBe(1);

  const onlyPaper = result.values().next();

  if (onlyPaper.value === undefined) {
    throw new Error('Unexpected empty Set');
  }

  const alphabeticallyFirst = Array.from(snapshot).sort()[0];

  expect(onlyPaper.value.representative).toBe(alphabeticallyFirst);
};

const expectLastEvaluatedAt = (
  result: ReadonlySet<EvaluatedPaper>,
  lastEvaluatedAt: Date,
) => {
  expect(result.size).toBe(1);

  const onlyElementInTheSet = result.values().next();

  if (onlyElementInTheSet.value === undefined) {
    throw new Error('Unexpected empty Set');
  }

  expect(
    onlyElementInTheSet.value.lastEvaluatedAt,
  ).toStrictEqual(
    lastEvaluatedAt,
  );
};

describe('get-papers-evaluated-by-group', () => {
  const expressionDoiA = arbitraryExpressionDoi();
  const expressionDoiB = arbitraryExpressionDoi();
  const expressionDoiC = arbitraryExpressionDoi();
  const evaluationRecordedAgainstExpressionDoiA: EventOfType<'EvaluationPublicationRecorded'> = {
    ...arbitraryEvaluationPublicationRecordedEvent(),
    groupId,
    articleId: expressionDoiA,
  };
  const evaluationRecordedAgainstExpressionDoiB: EventOfType<'EvaluationPublicationRecorded'> = {
    ...arbitraryEvaluationPublicationRecordedEvent(),
    groupId,
    articleId: expressionDoiB,
  };
  const evaluationRecordedAgainstExpressionDoiC: EventOfType<'EvaluationPublicationRecorded'> = {
    ...arbitraryEvaluationPublicationRecordedEvent(),
    groupId,
    articleId: expressionDoiC,
  };
  const paperSnapshotWithExpressionDoisAB: EventOfType<'PaperSnapshotRecorded'> = {
    ...arbitraryPaperSnapshotRecordedEvent(),
    expressionDois: arbitraryOrderSet([expressionDoiA, expressionDoiB]),
  };
  const paperSnapshotWithExpressionDoisABC: EventOfType<'PaperSnapshotRecorded'> = {
    ...arbitraryPaperSnapshotRecordedEvent(),
    expressionDois: arbitraryOrderSet([expressionDoiA, expressionDoiB, expressionDoiC]),
  };
  let result: ReadonlySet<EvaluatedPaper>;

  describe('given activity by considered groups', () => {
    describe('when an evaluation has been recorded against an expression, but no corresponding paper snapshot is available', () => {
      const events = [
        evaluationRecordedAgainstExpressionDoiA,
      ] satisfies ReadonlyArray<DomainEvent>;

      beforeEach(() => {
        result = runQuery(events, groupId);
      });

      it('does not return anything', () => {
        expect(result.size).toBe(0);
      });
    });

    describe('when an evaluation has been recorded against an expression which is part of a subsequently recorded paper snapshot', () => {
      const events = [
        evaluationRecordedAgainstExpressionDoiA,
        paperSnapshotWithExpressionDoisAB,
      ] satisfies ReadonlyArray<DomainEvent>;

      beforeEach(() => {
        result = runQuery(events, groupId);
      });

      it('returns the paper representative', () => {
        expectDeterministicSingleExpressionDoiFromSnapshot(result, paperSnapshotWithExpressionDoisAB.expressionDois);
      });

      it('returns a lastEvaluatedAt', () => {
        expectLastEvaluatedAt(result, evaluationRecordedAgainstExpressionDoiA.publishedAt);
      });
    });

    describe('when a paper snapshot has been recorded and then an evaluation is recorded against one of its expressions', () => {
      const events = [
        paperSnapshotWithExpressionDoisAB,
        evaluationRecordedAgainstExpressionDoiA,
      ] satisfies ReadonlyArray<DomainEvent>;

      beforeEach(() => {
        result = runQuery(events, groupId);
      });

      it('returns the paper representative', () => {
        expectDeterministicSingleExpressionDoiFromSnapshot(result, paperSnapshotWithExpressionDoisAB.expressionDois);
      });

      it('returns a lastEvaluatedAt', () => {
        expectLastEvaluatedAt(result, evaluationRecordedAgainstExpressionDoiA.publishedAt);
      });
    });

    describe('when an evaluation has been recorded, a paper snapshot recorded and then a newly published evaluation is recorded for the same group', () => {
      const anotherEvaluationRecordedAgainstExpressionDoiA = {
        ...arbitraryEvaluationPublicationRecordedEvent(),
        groupId,
        articleId: expressionDoiA,
        publishedAt: someTimeAfter(evaluationRecordedAgainstExpressionDoiA.publishedAt),
      };
      const events = [
        evaluationRecordedAgainstExpressionDoiA,
        paperSnapshotWithExpressionDoisAB,
        anotherEvaluationRecordedAgainstExpressionDoiA,
      ] satisfies ReadonlyArray<DomainEvent>;

      beforeEach(() => {
        result = runQuery(events, groupId);
      });

      it('returns the paper representative', () => {
        expectDeterministicSingleExpressionDoiFromSnapshot(result, paperSnapshotWithExpressionDoisAB.expressionDois);
      });

      it('returns a lastEvaluatedAt', () => {
        expectLastEvaluatedAt(result, anotherEvaluationRecordedAgainstExpressionDoiA.publishedAt);
      });
    });

    describe('when a paper snapshot has been recorded, followed by an evaluation, and then an earlier published evaluation', () => {
      const anotherEvaluationRecordedAgainstExpressionDoiA = {
        ...arbitraryEvaluationPublicationRecordedEvent(),
        groupId,
        articleId: expressionDoiA,
        publishedAt: someTimeBefore(evaluationRecordedAgainstExpressionDoiA.publishedAt),
      };
      const events = [
        paperSnapshotWithExpressionDoisAB,
        evaluationRecordedAgainstExpressionDoiA,
        anotherEvaluationRecordedAgainstExpressionDoiA,
      ] satisfies ReadonlyArray<DomainEvent>;

      beforeEach(() => {
        result = runQuery(events, groupId);
      });

      it('returns the paper representative', () => {
        expectDeterministicSingleExpressionDoiFromSnapshot(result, paperSnapshotWithExpressionDoisAB.expressionDois);
      });

      it('returns a lastEvaluatedAt', () => {
        expectLastEvaluatedAt(result, evaluationRecordedAgainstExpressionDoiA.publishedAt);
      });
    });

    describe('when an evaluation has been recorded, a paper snapshot recorded and then an earlier published evaluation is recorded for the same group', () => {
      const anotherEvaluationRecordedAgainstExpressionDoiA = {
        ...arbitraryEvaluationPublicationRecordedEvent(),
        groupId,
        articleId: expressionDoiA,
        publishedAt: someTimeBefore(evaluationRecordedAgainstExpressionDoiA.publishedAt),
      };
      const events = [
        evaluationRecordedAgainstExpressionDoiA,
        paperSnapshotWithExpressionDoisAB,
        anotherEvaluationRecordedAgainstExpressionDoiA,
      ] satisfies ReadonlyArray<DomainEvent>;

      beforeEach(() => {
        result = runQuery(events, groupId);
      });

      it('returns the paper representative', () => {
        expectDeterministicSingleExpressionDoiFromSnapshot(result, paperSnapshotWithExpressionDoisAB.expressionDois);
      });

      it('returns a lastEvaluatedAt', () => {
        expectLastEvaluatedAt(result, evaluationRecordedAgainstExpressionDoiA.publishedAt);
      });
    });

    describe('when two expressions have been evaluated and belong to the same paper according to a snapshot', () => {
      const newlyPublishedEvaluationRecordedAgainstExpressionDoiB = {
        ...evaluationRecordedAgainstExpressionDoiB,
        publishedAt: someTimeAfter(evaluationRecordedAgainstExpressionDoiA.publishedAt),
      };

      const events = [
        evaluationRecordedAgainstExpressionDoiA,
        newlyPublishedEvaluationRecordedAgainstExpressionDoiB,
        paperSnapshotWithExpressionDoisAB,
      ] satisfies ReadonlyArray<DomainEvent>;

      beforeEach(() => {
        result = runQuery(events, groupId);
      });

      it('returns the paper representative', () => {
        expectDeterministicSingleExpressionDoiFromSnapshot(result, paperSnapshotWithExpressionDoisAB.expressionDois);
      });

      it('returns a lastEvaluatedAt', () => {
        expectLastEvaluatedAt(result, newlyPublishedEvaluationRecordedAgainstExpressionDoiB.publishedAt);
      });
    });

    describe('when another expression of an already evaluated paper is evaluated', () => {
      const newlyPublishedEvaluationRecordedAgainstExpressionDoiB = {
        ...evaluationRecordedAgainstExpressionDoiB,
        publishedAt: someTimeAfter(evaluationRecordedAgainstExpressionDoiA.publishedAt),
      };
      const events = [
        evaluationRecordedAgainstExpressionDoiA,
        paperSnapshotWithExpressionDoisAB,
        newlyPublishedEvaluationRecordedAgainstExpressionDoiB,
      ] satisfies ReadonlyArray<DomainEvent>;

      beforeEach(() => {
        result = runQuery(events, groupId);
      });

      it('returns the paper representative', () => {
        expectDeterministicSingleExpressionDoiFromSnapshot(result, paperSnapshotWithExpressionDoisAB.expressionDois);
      });

      it('returns a lastEvaluatedAt', () => {
        expectLastEvaluatedAt(result, newlyPublishedEvaluationRecordedAgainstExpressionDoiB.publishedAt);
      });
    });

    describe('when two expressions have been evaluated for a known paper snapshot', () => {
      const newlyPublishedEvaluationRecordedAgainstExpressionDoiB = {
        ...evaluationRecordedAgainstExpressionDoiB,
        publishedAt: someTimeAfter(evaluationRecordedAgainstExpressionDoiA.publishedAt),
      };
      const events = [
        paperSnapshotWithExpressionDoisAB,
        evaluationRecordedAgainstExpressionDoiA,
        newlyPublishedEvaluationRecordedAgainstExpressionDoiB,
      ] satisfies ReadonlyArray<DomainEvent>;

      beforeEach(() => {
        result = runQuery(events, groupId);
      });

      it('returns the paper representative', () => {
        expectDeterministicSingleExpressionDoiFromSnapshot(result, paperSnapshotWithExpressionDoisAB.expressionDois);
      });

      it('returns a lastEvaluatedAt', () => {
        expectLastEvaluatedAt(result, newlyPublishedEvaluationRecordedAgainstExpressionDoiB.publishedAt);
      });
    });

    describe('when an expression is evaluated that was not in the first snapshot but in the second snapshot', () => {
      const newlyPublishedEvaluationRecordedAgainstExpressionDoiB = {
        ...evaluationRecordedAgainstExpressionDoiB,
        publishedAt: someTimeAfter(evaluationRecordedAgainstExpressionDoiA.publishedAt),
      };
      const newlyPublishedEvaluationRecordedAgainstExpressionDoiC = {
        ...evaluationRecordedAgainstExpressionDoiC,
        publishedAt: someTimeAfter(newlyPublishedEvaluationRecordedAgainstExpressionDoiB.publishedAt),
      };
      const events = [
        evaluationRecordedAgainstExpressionDoiA,
        paperSnapshotWithExpressionDoisAB,
        newlyPublishedEvaluationRecordedAgainstExpressionDoiB,
        newlyPublishedEvaluationRecordedAgainstExpressionDoiC,
        paperSnapshotWithExpressionDoisABC,
      ] satisfies ReadonlyArray<DomainEvent>;

      beforeEach(() => {
        result = runQuery(events, groupId);
      });

      it('returns the paper representative, chosen from the first snapshot', () => {
        expectDeterministicSingleExpressionDoiFromSnapshot(result, paperSnapshotWithExpressionDoisAB.expressionDois);
      });

      it('returns a lastEvaluatedAt', () => {
        expectLastEvaluatedAt(result, newlyPublishedEvaluationRecordedAgainstExpressionDoiC.publishedAt);
      });
    });

    describe('when an expression has been evaluated, a paper snapshot recorded, and then a wider paper snapshot is recorded', () => {
      // evaluate an expression with doi 10.1234/5555
      // record a paper snapshot with this expression
      // record a paper snapshot, including an expression with the DOIs 10.1234/1111, 10.1234/5555,
      // expect representative to be 10.1234/1111
      // expect one evaluated paper
      // expect lastEvaluatedAt date to be the date from the evaluation of 10.1234/5555

      const paperSnapshotWithExpressionDoiB = {
        ...arbitraryPaperSnapshotRecordedEvent(),
        expressionDois: arbitraryOrderSet([expressionDoiB]),
      };

      const events = [
        evaluationRecordedAgainstExpressionDoiB,
        paperSnapshotWithExpressionDoiB,
        paperSnapshotWithExpressionDoisAB,
      ] satisfies ReadonlyArray<DomainEvent>;

      beforeEach(() => {
        result = runQuery(events, groupId);
      });

      it('returns the paper representative, chosen from the first snapshot', () => {
        expectDeterministicSingleExpressionDoiFromSnapshot(result, paperSnapshotWithExpressionDoiB.expressionDois);
      });

      it('returns a lastEvaluatedAt', () => {
        expectLastEvaluatedAt(result, evaluationRecordedAgainstExpressionDoiB.publishedAt);
      });
    });

    describe('when the paper snapshot has been recorded and then another group evaluates the paper', () => {
      const evaluationRecordedAgainstExpressionDoiAByAnotherGroup = {
        ...arbitraryEvaluationPublicationRecordedEvent(),
        articleId: expressionDoiA,
        groupId: anotherGroupId,
      };

      const events = [
        evaluationRecordedAgainstExpressionDoiA,
        paperSnapshotWithExpressionDoisAB,
        evaluationRecordedAgainstExpressionDoiAByAnotherGroup,
      ] satisfies ReadonlyArray<DomainEvent>;

      describe('when queried for the first group', () => {
        beforeEach(() => {
          result = runQuery(events, groupId);
        });

        it('returns the paper representative', () => {
          expectDeterministicSingleExpressionDoiFromSnapshot(result, paperSnapshotWithExpressionDoisAB.expressionDois);
        });

        it('returns a lastEvaluatedAt', () => {
          expectLastEvaluatedAt(result, evaluationRecordedAgainstExpressionDoiA.publishedAt);
        });
      });

      describe('when queried for the other group', () => {
        it('returns the paper representative', () => {
          result = runQuery(events, anotherGroupId);

          expectDeterministicSingleExpressionDoiFromSnapshot(result, paperSnapshotWithExpressionDoisAB.expressionDois);
        });

        it('returns a lastEvaluatedAt', () => {
          expectLastEvaluatedAt(result, evaluationRecordedAgainstExpressionDoiAByAnotherGroup.publishedAt);
        });
      });
    });

    describe('when two groups evaluate different expressions that belong to the same paper', () => {
      const evaluationRecordedAgainstExpressionDoiCByAnotherGroup = {
        ...evaluationRecordedAgainstExpressionDoiC,
        groupId: anotherGroupId,
      };
      const events = [
        evaluationRecordedAgainstExpressionDoiA,
        paperSnapshotWithExpressionDoisAB,
        evaluationRecordedAgainstExpressionDoiCByAnotherGroup,
        paperSnapshotWithExpressionDoisABC,
      ];

      describe('when queried for the first group', () => {
        beforeEach(() => {
          result = runQuery(events, groupId);
        });

        it('returns the paper representative, chosen from the snapshot that makes the paper visible for the first group', () => {
          expectDeterministicSingleExpressionDoiFromSnapshot(result, paperSnapshotWithExpressionDoisAB.expressionDois);
        });

        it('returns a lastEvaluatedAt', () => {
          expectLastEvaluatedAt(result, evaluationRecordedAgainstExpressionDoiA.publishedAt);
        });
      });

      describe('when queried for the other group', () => {
        beforeEach(() => {
          result = runQuery(events, anotherGroupId);
        });

        it('returns the paper representative, chosen from the snapshot that makes the paper visible for the other group', () => {
          expectDeterministicSingleExpressionDoiFromSnapshot(result, paperSnapshotWithExpressionDoisABC.expressionDois);
        });

        it('returns a lastEvaluatedAt', () => {
          expectLastEvaluatedAt(result, evaluationRecordedAgainstExpressionDoiCByAnotherGroup.publishedAt);
        });
      });
    });
  });

  describe('given activity by a group not considered', () => {
    const groupIdNotConsidered = arbitraryGroupId();

    describe('when an evaluation has been recorded against an expression which is the only member of a subsequently recorded paper snapshot', () => {
      const paperSnapshotWithExpressionDoiA: EventOfType<'PaperSnapshotRecorded'> = {
        ...arbitraryPaperSnapshotRecordedEvent(),
        expressionDois: arbitraryOrderSet([expressionDoiA]),
      };
      const events = [
        {
          ...evaluationRecordedAgainstExpressionDoiA,
          groupId: groupIdNotConsidered,
        },
        paperSnapshotWithExpressionDoiA,
      ] satisfies ReadonlyArray<DomainEvent>;

      beforeEach(() => {
        result = runQuery(events, groupIdNotConsidered);
      });

      it('does not return anything', () => {
        expect(result.size).toBe(0);
      });
    });

    describe('when an evaluation has been recorded against an expression which is part of a subsequently recorded paper snapshot', () => {
      const events = [
        {
          ...evaluationRecordedAgainstExpressionDoiA,
          groupId: groupIdNotConsidered,
        },
        paperSnapshotWithExpressionDoisAB,
      ] satisfies ReadonlyArray<DomainEvent>;

      beforeEach(() => {
        result = runQuery(events, groupIdNotConsidered);
      });

      it('does not return anything', () => {
        expect(result.size).toBe(0);
      });
    });
  });
});
