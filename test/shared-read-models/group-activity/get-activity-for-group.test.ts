import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { handleEvent, initialState } from '../../../src/shared-read-models/group-activity/handle-event';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { getActivityForGroup } from '../../../src/shared-read-models/group-activity/get-activity-for-group';
import { evaluationRecorded, groupJoined } from '../../../src/domain-events';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

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
    describe('when there are no recorded evaluations', () => {
      const group = arbitraryGroup();
      const readModel = pipe(
        [
          groupJoined(
            group.id,
            group.name,
            group.avatarPath,
            group.descriptionPath,
            group.shortDescription,
            group.homepage,
            group.slug,
          ),
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
      const group = arbitraryGroup();
      const readModel = pipe(
        [
          groupJoined(
            group.id,
            group.name,
            group.avatarPath,
            group.descriptionPath,
            group.shortDescription,
            group.homepage,
            group.slug,
          ),
          evaluationRecorded(group.id, arbitraryArticleId(), arbitraryReviewId()),
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

      it.todo('returns the publishedAt date of the evaluation as the latestActivityAt');
    });

    describe('when there are 2 evaluations', () => {
      describe('and the most recently recorded is the most recently published evaluation', () => {
        it.todo('returns an evaluationCount of 2');

        it.todo('returns the most recent publishedAt date as the latestActivityAt');
      });

      describe('and the most recently recorded is not the most recently published evaluation', () => {
        it.todo('returns an evaluationCount of 2');

        it.todo('returns the most recent publishedAt date as the latestActivityAt');
      });
    });
  });
});
