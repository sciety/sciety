import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../../src/domain-events';
import { getPendingEvaluations, handleEvent, initialState } from '../../../src/read-models/evaluations-for-notifications/get-pending-evaluations';
import { arbitraryEvaluationPublicationRecordedEvent } from '../../domain-events/evaluation-resource-events.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';

const groupId = arbitraryGroupId();
const consideredGroupIds = [groupId];

const runQuery = (events: ReadonlyArray<DomainEvent>) => {
  const readModel = pipe(
    events,
    RA.reduce(initialState(), handleEvent(consideredGroupIds)),
  );
  return getPendingEvaluations(readModel)();
};

describe('get-pending-evaluations', () => {
  describe('given activity by considered groups', () => {
    describe('when an evaluation publication has been recorded', () => {
      const evaluationPublicationRecorded = {
        ...arbitraryEvaluationPublicationRecordedEvent(),
        groupId,
      };
      const events = [
        evaluationPublicationRecorded,
      ] satisfies ReadonlyArray<DomainEvent>;
      const result = runQuery(events);

      it.failing('returns the evaluation', () => {
        expect(result).toHaveLength(1);
        expect(result[0].evaluationLocator).toStrictEqual(evaluationPublicationRecorded.evaluationLocator);
        expect(result[0].expressionDoi).toStrictEqual(evaluationPublicationRecorded.articleId);
      });
    });

    describe('when two evaluation publications have been recorded', () => {
      it.todo('returns the evaluations');
    });

    describe('when no evaluation publications have been recorded', () => {
      it.todo('returns no evaluations');
    });
  });

  describe('given activity by a group that is not considered', () => {
    const evaluationPublicationRecorded = arbitraryEvaluationPublicationRecordedEvent();
    const events = [
      evaluationPublicationRecorded,
    ] satisfies ReadonlyArray<DomainEvent>;
    const result = runQuery(events);

    it.failing('returns no evaluations', () => {
      expect(result).toHaveLength(0);
    });
  });
});
