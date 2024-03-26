import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { handleEvent, initialState } from '../../../src/read-models/group-activity/handle-event';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { getActivityForGroup } from '../../../src/read-models/group-activity/get-activity-for-group';
import { DomainEvent, constructEvent } from '../../../src/domain-events';
import { arbitraryEvaluationPublicationRecordedEvent, arbitraryEvaluationRemovalRecordedEvent } from '../../domain-events/evaluation-resource-events.helper';
import { arbitraryDate, arbitraryString } from '../../helpers';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import { arbitraryGroupJoinedEvent } from '../../domain-events/group-resource-events.helper';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { GroupId } from '../../../src/types/group-id';

const getActivityForGroupHelper = (events: ReadonlyArray<DomainEvent>, groupId: GroupId) => {
  const readModel = pipe(
    events,
    RA.reduce(initialState(), handleEvent),
  );
  return getActivityForGroup(readModel)(groupId);
};

describe('get-activity-for-group', () => {
  describe('when the group has not joined', () => {
    describe('and no group activity has been recorded', () => {
      const result = getActivityForGroupHelper([], arbitraryGroupId());

      it('returns O.none', () => {
        expect(result).toStrictEqual(O.none);
      });
    });

    describe('and an evaluation\'s publication has been recorded', () => {
      const events = [
        arbitraryEvaluationPublicationRecordedEvent(),
      ];
      const result = getActivityForGroupHelper(events, events[0].groupId);

      it('returns O.none', () => {
        expect(result).toStrictEqual(O.none);
      });
    });

    describe('and an evaluation\'s publication has been recorded, and then erased by Sciety', () => {
      const evaluationPublicationRecorded = arbitraryEvaluationPublicationRecordedEvent();
      const events = [
        evaluationPublicationRecorded,
        constructEvent('IncorrectlyRecordedEvaluationErased')({
          evaluationLocator: evaluationPublicationRecorded.evaluationLocator,
        }),
      ];
      const result = getActivityForGroupHelper(events, evaluationPublicationRecorded.groupId);

      it('returns O.none', () => {
        expect(result).toStrictEqual(O.none);
      });
    });

    describe('and an evaluation\'s publication and removal have been recorded', () => {
      const evaluationPublicationRecorded = arbitraryEvaluationPublicationRecordedEvent();
      const events = [
        evaluationPublicationRecorded,
        {
          ...arbitraryEvaluationRemovalRecordedEvent(),
          evaluationLocator: evaluationPublicationRecorded.evaluationLocator,
        },
      ];
      const result = getActivityForGroupHelper(events, evaluationPublicationRecorded.groupId);

      it('returns O.none', () => {
        expect(result).toStrictEqual(O.none);
      });
    });
  });

  describe('when the group has joined', () => {
    const getActivityForGroupHelperExpectingSome = (events: ReadonlyArray<DomainEvent>, groupId: GroupId) => {
      const readModel = pipe(
        events,
        RA.reduce(initialState(), handleEvent),
      );
      return pipe(
        groupId,
        getActivityForGroup(readModel),
        O.getOrElseW(shouldNotBeCalled),
      );
    };

    const groupJoinedEvent = arbitraryGroupJoinedEvent();

    describe('when there are no recorded evaluations', () => {
      const activity = getActivityForGroupHelperExpectingSome([groupJoinedEvent], groupJoinedEvent.groupId);

      it('returns an evaluationCount of 0', () => {
        expect(activity.evaluationCount).toBe(0);
      });

      it('return a O.none for the latestActivityAt', () => {
        expect(activity.latestActivityAt).toStrictEqual(O.none);
      });
    });

    describe('when there is 1 recorded evaluation', () => {
      const publishedAt = new Date();
      const events = [
        groupJoinedEvent,
        {
          ...arbitraryEvaluationPublicationRecordedEvent(),
          groupId: groupJoinedEvent.groupId,
          publishedAt,
        },
      ];
      const activity = getActivityForGroupHelperExpectingSome(events, groupJoinedEvent.groupId);

      it('returns an evaluationCount of 1', () => {
        expect(activity.evaluationCount).toBe(1);
      });

      it('returns the publishedAt date of the evaluation as the latestActivityAt', () => {
        expect(activity.latestActivityAt).toStrictEqual(O.some(publishedAt));
      });
    });

    describe('when there are 2 evaluations', () => {
      describe('and the most recently recorded is the most recently published evaluation', () => {
        const mostRecentPublishedAt = new Date('2000');
        const events = [
          groupJoinedEvent,
          {
            ...arbitraryEvaluationPublicationRecordedEvent(),
            groupId: groupJoinedEvent.groupId,
            publishedAt: new Date('1970'),
          },
          {
            ...arbitraryEvaluationPublicationRecordedEvent(),
            groupId: groupJoinedEvent.groupId,
            publishedAt: mostRecentPublishedAt,
          },

        ];
        const activity = getActivityForGroupHelperExpectingSome(events, groupJoinedEvent.groupId);

        it('returns an evaluationCount of 2', () => {
          expect(activity.evaluationCount).toBe(2);
        });

        it('returns the most recent publishedAt date as the latestActivityAt', () => {
          expect(activity.latestActivityAt).toStrictEqual(O.some(mostRecentPublishedAt));
        });
      });

      describe('and the most recently recorded is not the most recently published evaluation', () => {
        const mostRecentPublishedAt = new Date('2000');
        const events = [
          groupJoinedEvent,
          {
            ...arbitraryEvaluationPublicationRecordedEvent(),
            groupId: groupJoinedEvent.groupId,
            publishedAt: mostRecentPublishedAt,
          },
          {
            ...arbitraryEvaluationPublicationRecordedEvent(),
            groupId: groupJoinedEvent.groupId,
            publishedAt: new Date('1970'),
          },
        ];
        const activity = getActivityForGroupHelperExpectingSome(events, groupJoinedEvent.groupId);

        it('returns an evaluationCount of 2', () => {
          expect(activity.evaluationCount).toBe(2);
        });

        it('returns the most recent publishedAt date as the latestActivityAt', () => {
          expect(activity.latestActivityAt).toStrictEqual(O.some(mostRecentPublishedAt));
        });
      });
    });

    describe('when one evaluation has been recorded, and erased by Sciety', () => {
      const evaluationLocator = arbitraryEvaluationLocator();
      const events = [
        groupJoinedEvent,
        {
          ...arbitraryEvaluationPublicationRecordedEvent(),
          groupId: groupJoinedEvent.groupId,
          evaluationLocator,
        },
        constructEvent('IncorrectlyRecordedEvaluationErased')({ evaluationLocator }),
      ];
      const activity = getActivityForGroupHelperExpectingSome(events, groupJoinedEvent.groupId);

      it('returns an evaluationCount of 0', () => {
        expect(activity.evaluationCount).toBe(0);
      });

      it('returns a O.none for the latestActivityAt', () => {
        expect(activity.latestActivityAt).toStrictEqual(O.none);
      });
    });

    describe('when two evaluations have been recorded, and one erased by Sciety', () => {
      const remainingEvaluationPublishedAt = new Date('1999');
      const evaluationToErase = arbitraryEvaluationLocator();
      const events = [
        groupJoinedEvent,
        {
          ...arbitraryEvaluationPublicationRecordedEvent(),
          groupId: groupJoinedEvent.groupId,
          publishedAt: remainingEvaluationPublishedAt,
        },
        {
          ...arbitraryEvaluationPublicationRecordedEvent(),
          groupId: groupJoinedEvent.groupId,
          evaluationLocator: evaluationToErase,
        },
        constructEvent('IncorrectlyRecordedEvaluationErased')({ evaluationLocator: evaluationToErase }),
      ];
      const activity = getActivityForGroupHelperExpectingSome(events, groupJoinedEvent.groupId);

      it('returns an evaluationCount of 1', () => {
        expect(activity.evaluationCount).toBe(1);
      });

      it('returns the latestActivityAt for the remaining evaluation', () => {
        expect(activity.latestActivityAt).toStrictEqual(O.some(remainingEvaluationPublishedAt));
      });
    });

    describe('when two evaluations have been recorded, and one evaluation removal has been recorded', () => {
      const remainingEvaluationPublishedAt = new Date('1999');
      const evaluationLocator = arbitraryEvaluationLocator();
      const events = [
        groupJoinedEvent,
        {
          ...arbitraryEvaluationPublicationRecordedEvent(),
          groupId: groupJoinedEvent.groupId,
          publishedAt: remainingEvaluationPublishedAt,
        },
        {
          ...arbitraryEvaluationPublicationRecordedEvent(),
          groupId: groupJoinedEvent.groupId,
          evaluationLocator,
        },
        {
          ...arbitraryEvaluationRemovalRecordedEvent(),
          evaluationLocator,
        },
      ];
      const activity = getActivityForGroupHelperExpectingSome(events, groupJoinedEvent.groupId);

      it('returns an evaluationCount of 1', () => {
        expect(activity.evaluationCount).toBe(1);
      });

      it('returns the latestActivityAt for the remaining evaluation', () => {
        expect(activity.latestActivityAt).toStrictEqual(O.some(remainingEvaluationPublishedAt));
      });
    });

    describe('when an evaluation\'s publication has been recorded twice', () => {
      const eventProperties = {
        groupId: groupJoinedEvent.groupId,
        articleId: arbitraryExpressionDoi(),
        evaluationLocator: arbitraryEvaluationLocator(),
        authors: [arbitraryString()],
        publishedAt: arbitraryDate(),
      };
      const events = [
        groupJoinedEvent,
        {
          ...arbitraryEvaluationPublicationRecordedEvent(),
          ...eventProperties,
        },
        {
          ...arbitraryEvaluationPublicationRecordedEvent(),
          ...eventProperties,
        },
      ];
      const activity = getActivityForGroupHelperExpectingSome(events, groupJoinedEvent.groupId);

      it('returns an evaluationCount of 1', () => {
        expect(activity.evaluationCount).toBe(1);
      });

      it('returns the latestActivityAt of the first recorded', () => {
        expect(activity.latestActivityAt).toStrictEqual(O.some(eventProperties.publishedAt));
      });
    });
  });
});
