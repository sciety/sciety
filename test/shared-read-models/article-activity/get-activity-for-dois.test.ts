import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { evaluationRecorded } from '../../../src/domain-events';
import { articleAddedToList } from '../../../src/domain-events/article-added-to-list-event';
import { getActivityForDois } from '../../../src/shared-read-models/article-activity/get-activity-for-dois';
import { arbitraryDate } from '../../helpers';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

describe('get-activity-for-dois', () => {
  describe('when the articleIds are in the read model', () => {
    it('returns the activity for those articles', () => {
      const articleId1 = arbitraryDoi();
      const articleId2 = arbitraryDoi();
      const date1 = arbitraryDate();
      const date2 = arbitraryDate();
      const activity = pipe(
        [
          evaluationRecorded(arbitraryGroupId(), articleId1, arbitraryReviewId(), [], date1),
          articleAddedToList(articleId1, arbitraryListId()),
          evaluationRecorded(arbitraryGroupId(), articleId2, arbitraryReviewId(), [], date2),
          articleAddedToList(articleId2, arbitraryListId()),
        ],
        getActivityForDois([articleId1, articleId2]),
      );

      expect(activity).toStrictEqual([
        {
          articleId: articleId1,
          latestActivityDate: O.some(date1),
          evaluationCount: 1,
          listMembershipCount: 1,
        },
        {
          articleId: articleId2,
          latestActivityDate: O.some(date2),
          evaluationCount: 1,
          listMembershipCount: 1,
        },
      ]);
    });
  });

  describe('when an articleId is not in the read model', () => {
    it('returns empty activity for that article', () => {
      const articleId = arbitraryDoi();
      const activity = pipe(
        [],
        getActivityForDois([articleId]),
      );

      expect(activity).toStrictEqual([
        {
          articleId,
          latestActivityDate: O.none,
          evaluationCount: 0,
          listMembershipCount: 0,
        },
      ]);
    });
  });
});
