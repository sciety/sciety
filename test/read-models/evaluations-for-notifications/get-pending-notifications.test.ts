import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent, EventOfType } from '../../../src/domain-events';
import { getPendingNotifications } from '../../../src/read-models/evaluations-for-notifications/get-pending-notifications';
import { Target, handleEvent, initialState } from '../../../src/read-models/evaluations-for-notifications/handle-event';
import { arbitraryCoarNotificationDeliveredEvent } from '../../domain-events/coar-notification-resource-events.helper';
import { arbitraryEvaluationPublicationRecordedEvent, arbitraryEvaluationRemovalRecordedEvent, arbitraryIncorrectlyRecordedEvaluationErasedEvent } from '../../domain-events/evaluation-resource-events.helper';
import { arbitraryString, arbitraryUrl } from '../../helpers';
import { arbitraryGroupId } from '../../types/group-id.helper';

const arbitraryTarget = (): Target => ({
  id: arbitraryString(),
  inbox: arbitraryUrl(),
});
const groupAId = arbitraryGroupId();
const groupBId = arbitraryGroupId();
const groupWithTwoTargetsId = arbitraryGroupId();
const targetForGroupA = arbitraryTarget();
const targetForGroupB = arbitraryTarget();
const target1 = arbitraryTarget();
const target2 = arbitraryTarget();
const consideredGroups = new Map([
  [groupAId, [targetForGroupA]],
  [groupBId, [targetForGroupB]],
  [groupWithTwoTargetsId, [target1, target2]],
]);

const runQuery = (events: ReadonlyArray<DomainEvent>) => {
  const readModel = pipe(
    events,
    RA.reduce(initialState(), handleEvent(consideredGroups)),
  );
  return getPendingNotifications(readModel)();
};

describe('get-pending-notifications', () => {
  describe('given no evaluation publications have been recorded', () => {
    const result = runQuery([]);

    it('returns no notifications', () => {
      expect(result).toHaveLength(0);
    });
  });

  describe('given activity by a group configured for one target', () => {
    describe('when an evaluation publication has been recorded', () => {
      const evaluationPublicationRecorded: EventOfType<'EvaluationPublicationRecorded'> = {
        ...arbitraryEvaluationPublicationRecordedEvent(),
        groupId: groupAId,
      };
      const evaluationRemovalRecorded: EventOfType<'EvaluationRemovalRecorded'> = {
        ...arbitraryEvaluationRemovalRecordedEvent(),
        evaluationLocator: evaluationPublicationRecorded.evaluationLocator,
      };
      const evaluationErased: EventOfType<'IncorrectlyRecordedEvaluationErased'> = {
        ...arbitraryIncorrectlyRecordedEvaluationErasedEvent(),
        evaluationLocator: evaluationPublicationRecorded.evaluationLocator,
      };

      describe('and nothing else happened', () => {
        const events = [
          evaluationPublicationRecorded,
        ];
        const result = runQuery(events);

        it('returns one notification', () => {
          expect(result).toHaveLength(1);
          expect(result[0]).toStrictEqual({
            evaluationLocator: evaluationPublicationRecorded.evaluationLocator,
            expressionDoi: evaluationPublicationRecorded.articleId,
            target: targetForGroupA,
          });
        });
      });

      describe('and its removal has been recorded', () => {
        const events = [
          evaluationPublicationRecorded,
          evaluationRemovalRecorded,
        ];
        const result = runQuery(events);

        it('returns no notifications', () => {
          expect(result).toHaveLength(0);
        });
      });

      describe('and the recording was erased', () => {
        const events = [
          evaluationPublicationRecorded,
          evaluationErased,
        ];
        const result = runQuery(events);

        it('returns no notifications', () => {
          expect(result).toHaveLength(0);
        });
      });

      describe('and the recording was erased, and the publication recorded again', () => {
        const evaluationPublicationRecordedAgain: EventOfType<'EvaluationPublicationRecorded'> = {
          ...arbitraryEvaluationPublicationRecordedEvent(),
          groupId: groupAId,
          evaluationLocator: evaluationPublicationRecorded.evaluationLocator,
        };
        const events = [
          evaluationPublicationRecorded,
          evaluationErased,
          evaluationPublicationRecordedAgain,
        ];
        const result = runQuery(events);

        it('returns one notification', () => {
          expect(result).toHaveLength(1);
          expect(result[0]).toStrictEqual({
            evaluationLocator: evaluationPublicationRecordedAgain.evaluationLocator,
            expressionDoi: evaluationPublicationRecordedAgain.articleId,
            target: targetForGroupA,
          });
        });
      });

      describe('and its removal has been recorded, and the recordings were erased', () => {
        const events = [
          evaluationPublicationRecorded,
          evaluationRemovalRecorded,
          evaluationErased,
        ];
        const result = runQuery(events);

        it('returns no notifications', () => {
          expect(result).toHaveLength(0);
        });
      });

      describe('and the notification has been delivered', () => {
        const coarNotificationDelivered: EventOfType<'CoarNotificationDelivered'> = {
          ...arbitraryCoarNotificationDeliveredEvent(),
          evaluationLocator: evaluationPublicationRecorded.evaluationLocator,
          targetId: targetForGroupA.id,
        };
        const events = [
          evaluationPublicationRecorded,
          coarNotificationDelivered,
        ];
        const result = runQuery(events);

        it('returns no notifications', () => {
          expect(result).toHaveLength(0);
        });
      });
    });

    describe('when two evaluation publications by the same group have been recorded', () => {
      const evaluationPublicationRecorded1: EventOfType<'EvaluationPublicationRecorded'> = {
        ...arbitraryEvaluationPublicationRecordedEvent(),
        groupId: groupAId,
      };
      const evaluationPublicationRecorded2: EventOfType<'EvaluationPublicationRecorded'> = {
        ...arbitraryEvaluationPublicationRecordedEvent(),
        groupId: groupAId,
      };

      describe('and nothing else has happened', () => {
        const events = [
          evaluationPublicationRecorded1,
          evaluationPublicationRecorded2,
        ];
        const result = runQuery(events);

        it('returns two notifications', () => {
          expect(result).toHaveLength(2);
          expect(result[0]).toStrictEqual({
            evaluationLocator: evaluationPublicationRecorded1.evaluationLocator,
            expressionDoi: evaluationPublicationRecorded1.articleId,
            target: targetForGroupA,
          });
          expect(result[1]).toStrictEqual({
            evaluationLocator: evaluationPublicationRecorded2.evaluationLocator,
            expressionDoi: evaluationPublicationRecorded2.articleId,
            target: targetForGroupA,
          });
        });
      });

      describe('and one notification has been delivered', () => {
        const coarNotificationDelivered: EventOfType<'CoarNotificationDelivered'> = {
          ...arbitraryCoarNotificationDeliveredEvent(),
          evaluationLocator: evaluationPublicationRecorded1.evaluationLocator,
          targetId: targetForGroupA.id,
        };
        const events = [
          evaluationPublicationRecorded1,
          evaluationPublicationRecorded2,
          coarNotificationDelivered,
        ];
        const result = runQuery(events);

        it('returns the remaining notification', () => {
          expect(result).toHaveLength(1);
          expect(result[0]).toStrictEqual({
            evaluationLocator: evaluationPublicationRecorded2.evaluationLocator,
            expressionDoi: evaluationPublicationRecorded2.articleId,
            target: targetForGroupA,
          });
        });
      });

      describe('when both notifications have been delivered', () => {
        const coarNotificationDelivered1: EventOfType<'CoarNotificationDelivered'> = {
          ...arbitraryCoarNotificationDeliveredEvent(),
          evaluationLocator: evaluationPublicationRecorded1.evaluationLocator,
          targetId: targetForGroupA.id,
        };
        const coarNotificationDelivered2: EventOfType<'CoarNotificationDelivered'> = {
          ...arbitraryCoarNotificationDeliveredEvent(),
          evaluationLocator: evaluationPublicationRecorded2.evaluationLocator,
          targetId: targetForGroupA.id,
        };
        const events = [
          evaluationPublicationRecorded1,
          evaluationPublicationRecorded2,
          coarNotificationDelivered1,
          coarNotificationDelivered2,
        ];
        const result = runQuery(events);

        it('returns no notifications', () => {
          expect(result).toHaveLength(0);
        });
      });
    });
  });

  describe('given activity by a group configured for two targets', () => {
    describe('when an evaluation publication has been recorded', () => {
      const evaluationPublicationRecorded: EventOfType<'EvaluationPublicationRecorded'> = {
        ...arbitraryEvaluationPublicationRecordedEvent(),
        groupId: groupWithTwoTargetsId,
      };

      describe('and nothing else happened', () => {
        const events = [
          evaluationPublicationRecorded,
        ];
        const result = runQuery(events);

        it('returns two notifications', () => {
          expect(result).toHaveLength(2);
          expect(result[0]).toStrictEqual({
            evaluationLocator: evaluationPublicationRecorded.evaluationLocator,
            expressionDoi: evaluationPublicationRecorded.articleId,
            target: target1,
          });
          expect(result[1]).toStrictEqual({
            evaluationLocator: evaluationPublicationRecorded.evaluationLocator,
            expressionDoi: evaluationPublicationRecorded.articleId,
            target: target2,
          });
        });
      });

      describe('and the notification referring to the first target has been delivered', () => {
        const coarNotificationDelivered: EventOfType<'CoarNotificationDelivered'> = {
          ...arbitraryCoarNotificationDeliveredEvent(),
          evaluationLocator: evaluationPublicationRecorded.evaluationLocator,
          targetId: target1.id,
        };
        const events = [
          evaluationPublicationRecorded,
          coarNotificationDelivered,
        ];
        const result = runQuery(events);

        it('returns the remaining notification', () => {
          expect(result).toHaveLength(1);
          expect(result[0]).toStrictEqual({
            evaluationLocator: evaluationPublicationRecorded.evaluationLocator,
            expressionDoi: evaluationPublicationRecorded.articleId,
            target: target2,
          });
        });
      });

      describe('and the notification referring to the second target has been delivered', () => {
        const coarNotificationDelivered: EventOfType<'CoarNotificationDelivered'> = {
          ...arbitraryCoarNotificationDeliveredEvent(),
          evaluationLocator: evaluationPublicationRecorded.evaluationLocator,
          targetId: target2.id,
        };
        const events = [
          evaluationPublicationRecorded,
          coarNotificationDelivered,
        ];
        const result = runQuery(events);

        it('returns the remaining notification', () => {
          expect(result).toHaveLength(1);
          expect(result[0]).toStrictEqual({
            evaluationLocator: evaluationPublicationRecorded.evaluationLocator,
            expressionDoi: evaluationPublicationRecorded.articleId,
            target: target1,
          });
        });
      });

      describe('when both notifications have been delivered', () => {
        const coarNotificationDeliveredForTarget1: EventOfType<'CoarNotificationDelivered'> = {
          ...arbitraryCoarNotificationDeliveredEvent(),
          evaluationLocator: evaluationPublicationRecorded.evaluationLocator,
          targetId: target1.id,
        };
        const coarNotificationDeliveredForTarget2: EventOfType<'CoarNotificationDelivered'> = {
          ...arbitraryCoarNotificationDeliveredEvent(),
          evaluationLocator: evaluationPublicationRecorded.evaluationLocator,
          targetId: target2.id,
        };
        const events = [
          evaluationPublicationRecorded,
          coarNotificationDeliveredForTarget2,
          coarNotificationDeliveredForTarget1,
        ];
        const result = runQuery(events);

        it('returns no notifications', () => {
          expect(result).toHaveLength(0);
        });
      });

      describe('and the recording was erased', () => {
        const evaluationErased: EventOfType<'IncorrectlyRecordedEvaluationErased'> = {
          ...arbitraryIncorrectlyRecordedEvaluationErasedEvent(),
          evaluationLocator: evaluationPublicationRecorded.evaluationLocator,
        };
        const events = [
          evaluationPublicationRecorded,
          evaluationErased,
        ];
        const result = runQuery(events);

        it('returns no notifications', () => {
          expect(result).toHaveLength(0);
        });
      });

      describe('and its removal has been recorded', () => {
        const evaluationRemovalRecorded: EventOfType<'EvaluationRemovalRecorded'> = {
          ...arbitraryEvaluationRemovalRecordedEvent(),
          evaluationLocator: evaluationPublicationRecorded.evaluationLocator,
        };
        const events = [
          evaluationPublicationRecorded,
          evaluationRemovalRecorded,
        ];

        const result = runQuery(events);

        it('returns no notifications', () => {
          expect(result).toHaveLength(0);
        });
      });
    });
  });

  describe('given activity by groups configured for different targets', () => {
    describe('when two evaluation publications by two different groups have been recorded', () => {
      const evaluationPublicationRecorded1: EventOfType<'EvaluationPublicationRecorded'> = {
        ...arbitraryEvaluationPublicationRecordedEvent(),
        groupId: groupAId,
      };
      const evaluationPublicationRecorded2: EventOfType<'EvaluationPublicationRecorded'> = {
        ...arbitraryEvaluationPublicationRecordedEvent(),
        groupId: groupBId,
      };
      const events = [
        evaluationPublicationRecorded1,
        evaluationPublicationRecorded2,
      ];
      const result = runQuery(events);

      it('returns two notifications', () => {
        expect(result).toHaveLength(2);
        expect(result[0]).toStrictEqual({
          evaluationLocator: evaluationPublicationRecorded1.evaluationLocator,
          expressionDoi: evaluationPublicationRecorded1.articleId,
          target: targetForGroupA,
        });
        expect(result[1]).toStrictEqual({
          evaluationLocator: evaluationPublicationRecorded2.evaluationLocator,
          expressionDoi: evaluationPublicationRecorded2.articleId,
          target: targetForGroupB,
        });
      });
    });
  });

  describe('given activity by a group that is not configured for any target', () => {
    const evaluationPublicationRecorded = arbitraryEvaluationPublicationRecordedEvent();
    const events = [
      evaluationPublicationRecorded,
    ];
    const result = runQuery(events);

    it('returns no notifications', () => {
      expect(result).toHaveLength(0);
    });
  });
});
