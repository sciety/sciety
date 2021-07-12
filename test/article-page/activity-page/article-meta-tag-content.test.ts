import * as O from 'fp-ts/Option';
import { articleMetaTagContent } from '../../../src/article-page/activity-page/article-meta-tag-content';
import { arbitraryDate, arbitraryString } from '../../helpers';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

const arbitraryFeedItem = (type: 'review') => ({
  id: arbitraryReviewId(),
  type,
  source: O.none,
  occurredAt: arbitraryDate(),
  groupId: arbitraryGroupId(),
  groupName: arbitraryString(),
  groupAvatar: arbitraryString(),
  fullText: O.none,
  counts: { helpfulCount: 0, notHelpfulCount: 0 },
  current: O.none,
});

describe('article-meta-tag-content', () => {
  it('returns a count of the evaluations', () => {
    const result = articleMetaTagContent([
      arbitraryFeedItem('review'),
      arbitraryFeedItem('review'),
    ]);

    expect(result.evaluationCount).toStrictEqual(2);
  });
});
