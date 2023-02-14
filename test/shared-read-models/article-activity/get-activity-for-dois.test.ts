import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { evaluationRecorded } from '../../../src/domain-events';
import { articleAddedToList } from '../../../src/domain-events/article-added-to-list-event';
import { arbitraryDate } from '../../helpers';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';
import { handleEvent, initialState } from '../../../src/shared-read-models/article-activity';
import { getActivityForDois } from '../../../src/shared-read-models/article-activity/get-activity-for-dois';

describe('get-activity-for-dois', () => {
  describe('when the articleIds are in the read model', () => {
    const articleId1 = arbitraryDoi();
    const articleId2 = arbitraryDoi();
    const date1 = arbitraryDate();
    const date2 = arbitraryDate();
    const readmodel = pipe(
      [
        evaluationRecorded(arbitraryGroupId(), articleId1, arbitraryReviewId(), [], date1),
        articleAddedToList(articleId1, arbitraryListId()),
        evaluationRecorded(arbitraryGroupId(), articleId2, arbitraryReviewId(), [], date2),
        articleAddedToList(articleId2, arbitraryListId()),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns the activity for those articles', () => {
      expect(getActivityForDois(readmodel)([articleId1, articleId2])).toStrictEqual([
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
});
