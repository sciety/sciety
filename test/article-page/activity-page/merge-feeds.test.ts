import { URL } from 'url';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { mergeFeeds } from '../../../src/article-page/activity-page/merge-feeds';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

describe('merge-feeds', () => {
  const firstDate = new Date('2020-09-03');
  const secondDate = new Date('2020-09-10');
  const thirdDate = new Date('2020-09-24');
  const feed1 = T.of([
    {
      type: 'review',
      groupId: arbitraryGroupId(),
      reviewId: arbitraryReviewId(),
      publishedAt: secondDate,
    },
  ] as const);
  const feed2 = T.of([
    {
      type: 'article-version',
      source: new URL('https://www.biorxiv.org/content/10.1101/2020.09.02.278911v2'),
      publishedAt: thirdDate,
      version: 2,
    },
    {
      type: 'article-version',
      source: new URL('https://www.biorxiv.org/content/10.1101/2020.09.02.278911v1'),
      publishedAt: firstDate,
      version: 1,
    },
  ] as const);

  it('merges feed event lists', async () => {
    const feedEvents = await pipe(
      [feed1, feed2],
      mergeFeeds,
    )();

    expect(feedEvents[0]).toMatchObject({
      type: 'article-version',
      version: 2,
    });
    expect(feedEvents[1]).toMatchObject({
      type: 'review',
    });
    expect(feedEvents[2]).toMatchObject({
      type: 'article-version',
      version: 1,
    });
  });

  it('sorts feed items by date descending', async () => {
    const feedEvents = await pipe(
      [feed1, feed2],
      mergeFeeds,
    )();

    expect(feedEvents[0].publishedAt).toStrictEqual(thirdDate);
    expect(feedEvents[1].publishedAt).toStrictEqual(secondDate);
    expect(feedEvents[2].publishedAt).toStrictEqual(firstDate);
  });
});
