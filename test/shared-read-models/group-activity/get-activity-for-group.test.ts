import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { handleEvent, initialState } from '../../../src/shared-read-models/group-activity/handle-event';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { getActivityForGroup } from '../../../src/shared-read-models/group-activity/get-activity-for-group';
import { constructEvent } from '../../../src/domain-events';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryRecordedEvaluation } from '../../types/recorded-evaluation.helper';
import { arbitraryEvaluationRecordedEvent, evaluationRecordedHelper } from '../../types/evaluation-recorded-event.helper';
import { arbitraryDate } from '../../helpers';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';
import { arbitraryEvaluationRemovalRecordedEvent } from '../../types/evaluation-removal-recorded-event-helper';

describe('get-activity-for-group', () => {
  const group = arbitraryGroup();

  describe('when the group has not joined', () => {
    describe('and no group activity has been recorded', () => {
      const readModel = pipe(
        [],
        RA.reduce(initialState(), handleEvent),
      );
      const result = getActivityForGroup(readModel)(arbitraryGroupId());

      it('returns O.none', () => {
        expect(result).toStrictEqual(O.none);
      });
    });

    describe('and an evaluation\'s publication has been recorded', () => {
      const recordedEvaluation = {
        ...arbitraryRecordedEvaluation(),
        groupId: group.id,
      };
      let result: O.Option<unknown>;

      beforeEach(() => {
        const readModel = pipe(
          [
            evaluationRecordedHelper(
              recordedEvaluation.groupId,
              recordedEvaluation.articleId,
              recordedEvaluation.evaluationLocator,
              recordedEvaluation.authors,
              recordedEvaluation.publishedAt,
            ),
          ],
          RA.reduce(initialState(), handleEvent),
        );
        result = getActivityForGroup(readModel)(group.id);
      });

      it('returns O.none', () => {
        expect(result).toStrictEqual(O.none);
      });
    });

    describe('and an evaluation\'s publication has been recorded, and then erased by Sciety', () => {
      let result: O.Option<unknown>;

      beforeEach(() => {
        const evaluationLocator = arbitraryEvaluationLocator();
        const readModel = pipe(
          [
            {
              ...arbitraryEvaluationRecordedEvent(),
              groupId: group.id,
              evaluationLocator,
            },
            constructEvent('IncorrectlyRecordedEvaluationErased')({ evaluationLocator }),
          ],
          RA.reduce(initialState(), handleEvent),
        );
        result = getActivityForGroup(readModel)(group.id);
      });

      it('returns O.none', () => {
        expect(result).toStrictEqual(O.none);
      });
    });

    describe('and an evaluation\'s publication and removal have been recorded', () => {
      let result: O.Option<unknown>;

      beforeEach(() => {
        const evaluationLocator = arbitraryEvaluationLocator();
        const readModel = pipe(
          [
            {
              ...arbitraryEvaluationRecordedEvent(),
              groupId: group.id,
              evaluationLocator,
            },
            {
              ...arbitraryEvaluationRemovalRecordedEvent(),
              evaluationLocator,
            },
          ],
          RA.reduce(initialState(), handleEvent),
        );
        result = getActivityForGroup(readModel)(group.id);
      });

      it('returns O.none', () => {
        expect(result).toStrictEqual(O.none);
      });
    });
  });

  describe('when the group has joined', () => {
    const groupJoinedEvent = constructEvent('GroupJoined')({
      groupId: group.id,
      name: group.name,
      avatarPath: group.avatarPath,
      descriptionPath: group.descriptionPath,
      shortDescription: group.shortDescription,
      homepage: group.homepage,
      slug: group.slug,
    });

    describe('when there are no recorded evaluations', () => {
      const readModel = pipe(
        [
          groupJoinedEvent,
        ],
        RA.reduce(initialState(), handleEvent),
      );
      const result = getActivityForGroup(readModel)(group.id);

      it('returns an evaluationCount of 0', () => {
        expect(result).toStrictEqual(O.some(
          expect.objectContaining({
            evaluationCount: 0,
          }),
        ));
      });

      it('return a O.none for the latestActivityAt', () => {
        expect(result).toStrictEqual(O.some(
          expect.objectContaining({
            latestActivityAt: O.none,
          }),
        ));
      });
    });

    describe('when there is 1 recorded evaluation', () => {
      const recordedEvaluation = {
        ...arbitraryRecordedEvaluation(),
        groupId: group.id,
      };
      const readModel = pipe(
        [
          groupJoinedEvent,
          evaluationRecordedHelper(
            recordedEvaluation.groupId,
            recordedEvaluation.articleId,
            recordedEvaluation.evaluationLocator,
            recordedEvaluation.authors,
            recordedEvaluation.publishedAt,
          ),
        ],
        RA.reduce(initialState(), handleEvent),
      );
      const result = getActivityForGroup(readModel)(group.id);

      it('returns an evaluationCount of 1', () => {
        expect(result).toStrictEqual(O.some(
          expect.objectContaining({
            evaluationCount: 1,
          }),
        ));
      });

      it('returns the publishedAt date of the evaluation as the latestActivityAt', () => {
        expect(result).toStrictEqual(O.some(
          expect.objectContaining({
            latestActivityAt: O.some(recordedEvaluation.publishedAt),
          }),
        ));
      });
    });

    describe('when there are 2 evaluations', () => {
      describe('and the most recently recorded is the most recently published evaluation', () => {
        const recordedEvaluation1 = {
          ...arbitraryRecordedEvaluation(),
          groupId: group.id,
          publishedAt: new Date('1970'),
        };
        const mostRecentPublishedAt = new Date('2000');
        const recordedEvaluation2 = {
          ...arbitraryRecordedEvaluation(),
          groupId: group.id,
          publishedAt: mostRecentPublishedAt,
        };
        const readModel = pipe(
          [
            groupJoinedEvent,
            evaluationRecordedHelper(
              recordedEvaluation1.groupId,
              recordedEvaluation1.articleId,
              recordedEvaluation1.evaluationLocator,
              recordedEvaluation1.authors,
              recordedEvaluation1.publishedAt,
            ),
            evaluationRecordedHelper(
              recordedEvaluation2.groupId,
              recordedEvaluation2.articleId,
              recordedEvaluation2.evaluationLocator,
              recordedEvaluation2.authors,
              recordedEvaluation2.publishedAt,
            ),
          ],
          RA.reduce(initialState(), handleEvent),
        );
        const result = getActivityForGroup(readModel)(group.id);

        it('returns an evaluationCount of 2', () => {
          expect(result).toStrictEqual(O.some(
            expect.objectContaining({
              evaluationCount: 2,
            }),
          ));
        });

        it('returns the most recent publishedAt date as the latestActivityAt', () => {
          expect(result).toStrictEqual(O.some(
            expect.objectContaining({
              latestActivityAt: O.some(mostRecentPublishedAt),
            }),
          ));
        });
      });

      describe('and the most recently recorded is not the most recently published evaluation', () => {
        const mostRecentPublishedAt = new Date('2000');
        const recordedEvaluation1 = {
          ...arbitraryRecordedEvaluation(),
          groupId: group.id,
          publishedAt: mostRecentPublishedAt,
        };
        const recordedEvaluation2 = {
          ...arbitraryRecordedEvaluation(),
          groupId: group.id,
          publishedAt: new Date('1970'),
        };
        const readModel = pipe(
          [
            groupJoinedEvent,
            evaluationRecordedHelper(
              recordedEvaluation1.groupId,
              recordedEvaluation1.articleId,
              recordedEvaluation1.evaluationLocator,
              recordedEvaluation1.authors,
              recordedEvaluation1.publishedAt,
            ),
            evaluationRecordedHelper(
              recordedEvaluation2.groupId,
              recordedEvaluation2.articleId,
              recordedEvaluation2.evaluationLocator,
              recordedEvaluation2.authors,
              recordedEvaluation2.publishedAt,
            ),
          ],
          RA.reduce(initialState(), handleEvent),
        );
        const result = getActivityForGroup(readModel)(group.id);

        it('returns an evaluationCount of 2', () => {
          expect(result).toStrictEqual(O.some(
            expect.objectContaining({
              evaluationCount: 2,
            }),
          ));
        });

        it('returns the most recent publishedAt date as the latestActivityAt', () => {
          expect(result).toStrictEqual(O.some(
            expect.objectContaining({
              latestActivityAt: O.some(mostRecentPublishedAt),
            }),
          ));
        });
      });
    });

    describe('when one evaluation has been recorded, and erased by Sciety', () => {
      const recordedEvaluation = {
        ...arbitraryRecordedEvaluation(),
        groupId: group.id,
      };
      const readModel = pipe(
        [
          groupJoinedEvent,
          evaluationRecordedHelper(
            recordedEvaluation.groupId,
            recordedEvaluation.articleId,
            recordedEvaluation.evaluationLocator,
            recordedEvaluation.authors,
            recordedEvaluation.publishedAt,
          ),
          constructEvent('IncorrectlyRecordedEvaluationErased')({ evaluationLocator: recordedEvaluation.evaluationLocator }),
        ],
        RA.reduce(initialState(), handleEvent),
      );
      const result = getActivityForGroup(readModel)(group.id);

      it('returns an evaluationCount of 0', () => {
        expect(result).toStrictEqual(O.some(
          expect.objectContaining({
            evaluationCount: 0,
          }),
        ));
      });

      it('returns a O.none for the latestActivityAt', () => {
        expect(result).toStrictEqual(O.some(
          expect.objectContaining({
            latestActivityAt: O.none,
          }),
        ));
      });
    });

    describe('when two evaluations have been recorded, and one erased by Sciety', () => {
      const remainingEvaluationPublishedAt = new Date('1999');
      const evaluationToErase = arbitraryEvaluationLocator();
      const readModel = pipe(
        [
          groupJoinedEvent,
          {
            ...arbitraryEvaluationRecordedEvent(),
            groupId: group.id,
            publishedAt: remainingEvaluationPublishedAt,
          },
          {
            ...arbitraryEvaluationRecordedEvent(),
            groupId: group.id,
            evaluationLocator: evaluationToErase,
          },
          constructEvent('IncorrectlyRecordedEvaluationErased')({ evaluationLocator: evaluationToErase }),
        ],
        RA.reduce(initialState(), handleEvent),
      );
      const result = getActivityForGroup(readModel)(group.id);

      it('returns an evaluationCount of 1', () => {
        expect(result).toStrictEqual(O.some(
          expect.objectContaining({
            evaluationCount: 1,
          }),
        ));
      });

      it('returns the latestActivityAt for the remaining evaluation', () => {
        expect(result).toStrictEqual(O.some(
          expect.objectContaining({
            latestActivityAt: O.some(remainingEvaluationPublishedAt),
          }),
        ));
      });
    });

    describe('when two evaluations have been recorded, and one evaluation removal has been recorded', () => {
      const remainingEvaluationPublishedAt = new Date('1999');
      const evaluationLocator = arbitraryEvaluationLocator();
      const readModel = pipe(
        [
          groupJoinedEvent,
          {
            ...arbitraryEvaluationRecordedEvent(),
            groupId: group.id,
            publishedAt: remainingEvaluationPublishedAt,
          },
          {
            ...arbitraryEvaluationRecordedEvent(),
            groupId: group.id,
            evaluationLocator,
          },
          {
            ...arbitraryEvaluationRemovalRecordedEvent(),
            evaluationLocator,
          },
        ],
        RA.reduce(initialState(), handleEvent),
      );
      const result = getActivityForGroup(readModel)(group.id);

      it('returns an evaluationCount of 1', () => {
        expect(result).toStrictEqual(O.some(
          expect.objectContaining({
            evaluationCount: 1,
          }),
        ));
      });

      it('returns the latestActivityAt for the remaining evaluation', () => {
        expect(result).toStrictEqual(O.some(
          expect.objectContaining({
            latestActivityAt: O.some(remainingEvaluationPublishedAt),
          }),
        ));
      });
    });

    describe('when an evaluation\'s publication has been recorded twice', () => {
      const evaluation = {
        ...arbitraryRecordedEvaluation(),
        groupId: group.id,
        publishedAt: new Date('1999'),
      };
      const readModel = pipe(
        [
          groupJoinedEvent,
          evaluationRecordedHelper(
            evaluation.groupId,
            evaluation.articleId,
            evaluation.evaluationLocator,
            evaluation.authors,
            evaluation.publishedAt,
          ),
          evaluationRecordedHelper(
            evaluation.groupId,
            evaluation.articleId,
            evaluation.evaluationLocator,
            evaluation.authors,
            arbitraryDate(),
          ),
        ],
        RA.reduce(initialState(), handleEvent),
      );
      const result = getActivityForGroup(readModel)(group.id);

      it('returns an evaluationCount of 1', () => {
        expect(result).toStrictEqual(O.some(
          expect.objectContaining({
            evaluationCount: 1,
          }),
        ));
      });

      it('returns the latestActivityAt of the first recorded', () => {
        expect(result).toStrictEqual(O.some(
          expect.objectContaining({
            latestActivityAt: O.some(evaluation.publishedAt),
          }),
        ));
      });
    });
  });
});
