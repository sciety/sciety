import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { handleEvent, initialState } from '../../../src/shared-read-models/group-activity/handle-event';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { getActivityForGroup } from '../../../src/shared-read-models/group-activity/get-activity-for-group';
import { evaluationRecorded, groupJoined } from '../../../src/domain-events';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryRecordedEvaluation } from '../../types/recorded-evaluation.helper';

describe('get-activity-for-group', () => {
  describe('when the group does not exist', () => {
    const readModel = pipe(
      [],
      RA.reduce(initialState(), handleEvent),
    );
    const result = getActivityForGroup(readModel)(arbitraryGroupId());

    it('returns O.none', () => {
      expect(result).toStrictEqual(O.none);
    });
  });

  describe('when the group exists', () => {
    const group = arbitraryGroup();
    const groupJoinedEvent = groupJoined(
      group.id,
      group.name,
      group.avatarPath,
      group.descriptionPath,
      group.shortDescription,
      group.homepage,
      group.slug,
    );

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
          evaluationRecorded(
            recordedEvaluation.groupId,
            recordedEvaluation.articleId,
            recordedEvaluation.reviewId,
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
            evaluationRecorded(
              recordedEvaluation1.groupId,
              recordedEvaluation1.articleId,
              recordedEvaluation1.reviewId,
              recordedEvaluation1.authors,
              recordedEvaluation1.publishedAt,
            ),
            evaluationRecorded(
              recordedEvaluation2.groupId,
              recordedEvaluation2.articleId,
              recordedEvaluation2.reviewId,
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
        it.todo('returns an evaluationCount of 2');

        it.todo('returns the most recent publishedAt date as the latestActivityAt');
      });
    });
  });
});
