import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../../src/domain-events';
import { getPendingEvaluations, handleEvent, initialState } from '../../../src/read-models/evaluations-for-notifications/get-pending-evaluations';
import { arbitraryEvaluationPublicationRecordedEvent } from '../../domain-events/evaluation-resource-events.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';

const groupId = arbitraryGroupId();
const anotherGroupId = arbitraryGroupId();
const consideredGroupIds = [groupId, anotherGroupId];

const runQuery = (events: ReadonlyArray<DomainEvent>) => {
  const readModel = pipe(
    events,
    RA.reduce(initialState(), handleEvent(consideredGroupIds)),
  );
  return getPendingEvaluations(readModel)();
};

describe('get-pending-evaluations', () => {
  describe('given activity by considered groups', () => {
    describe('when no evaluation publications have been recorded', () => {
      const events = [] satisfies ReadonlyArray<DomainEvent>;
      const result = runQuery(events);

      it('returns no evaluations', () => {
        expect(result).toHaveLength(0);
      });
    });

    describe('when an evaluation publication has been recorded', () => {
      const evaluationPublicationRecorded = {
        ...arbitraryEvaluationPublicationRecordedEvent(),
        groupId,
      };
      const events = [
        evaluationPublicationRecorded,
      ] satisfies ReadonlyArray<DomainEvent>;
      const result = runQuery(events);

      it('returns the evaluation', () => {
        expect(result).toHaveLength(1);
        expect(result[0].evaluationLocator).toStrictEqual(evaluationPublicationRecorded.evaluationLocator);
        expect(result[0].expressionDoi).toStrictEqual(evaluationPublicationRecorded.articleId);
      });
    });

    describe('when two evaluation publications by the same group have been recorded', () => {
      const evaluationPublicationRecorded1 = {
        ...arbitraryEvaluationPublicationRecordedEvent(),
        groupId,
      };
      const evaluationPublicationRecorded2 = {
        ...arbitraryEvaluationPublicationRecordedEvent(),
        groupId,
      };
      const events = [
        evaluationPublicationRecorded1,
        evaluationPublicationRecorded2,
      ] satisfies ReadonlyArray<DomainEvent>;
      const result = runQuery(events);

      it('returns the evaluations', () => {
        expect(result).toHaveLength(2);
        expect(result[0].evaluationLocator).toStrictEqual(evaluationPublicationRecorded1.evaluationLocator);
        expect(result[0].expressionDoi).toStrictEqual(evaluationPublicationRecorded1.articleId);
        expect(result[1].evaluationLocator).toStrictEqual(evaluationPublicationRecorded2.evaluationLocator);
        expect(result[1].expressionDoi).toStrictEqual(evaluationPublicationRecorded2.articleId);
      });
    });

    describe('when two evaluation publications by two different groups have been recorded', () => {
      const evaluationPublicationRecorded1 = {
        ...arbitraryEvaluationPublicationRecordedEvent(),
        groupId,
      };
      const evaluationPublicationRecorded2 = {
        ...arbitraryEvaluationPublicationRecordedEvent(),
        anotherGroupId,
      };
      const events = [
        evaluationPublicationRecorded1,
        evaluationPublicationRecorded2,
      ] satisfies ReadonlyArray<DomainEvent>;
      const result = runQuery(events);

      it.failing('returns the evaluations', () => {
        expect(result).toHaveLength(2);
        expect(result[0].evaluationLocator).toStrictEqual(evaluationPublicationRecorded1.evaluationLocator);
        expect(result[0].expressionDoi).toStrictEqual(evaluationPublicationRecorded1.articleId);
        expect(result[1].evaluationLocator).toStrictEqual(evaluationPublicationRecorded2.evaluationLocator);
        expect(result[1].expressionDoi).toStrictEqual(evaluationPublicationRecorded2.articleId);
      });
    });
  });

  describe('given activity by a group that is not considered', () => {
    const evaluationPublicationRecorded = arbitraryEvaluationPublicationRecordedEvent();
    const events = [
      evaluationPublicationRecorded,
    ] satisfies ReadonlyArray<DomainEvent>;
    const result = runQuery(events);

    it('returns no evaluations', () => {
      expect(result).toHaveLength(0);
    });
  });
});
