import { URL } from 'url';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as RFI from './review-feed-item.helper';
import { articleMetaTagContent } from '../../../src/article-page/activity-page/article-meta-tag-content';
import { arbitraryDate, arbitraryNumber, arbitraryUri } from '../../helpers';

const arbitraryArticleVersionFeedItem = (publishedAt: Date = arbitraryDate()) => ({
  type: 'article-version' as const,
  source: new URL(arbitraryUri()),
  publishedAt,
  version: arbitraryNumber(1, 10),
  server: 'biorxiv' as const,
});

describe('article-meta-tag-content', () => {
  it('returns a count of the evaluations', () => {
    const result = articleMetaTagContent([
      RFI.arbitrary(),
      RFI.arbitrary(),
    ]);

    expect(result.evaluationCount).toBe(2);
  });

  it('ignores non-evaluation feed items', () => {
    const result = articleMetaTagContent([
      arbitraryArticleVersionFeedItem(),
    ]);

    expect(result.evaluationCount).toBe(0);
  });

  it('returns a latest version', () => {
    const date = arbitraryDate();
    const result = articleMetaTagContent([
      arbitraryArticleVersionFeedItem(date),
      arbitraryArticleVersionFeedItem(new Date('01-01-1970')),
    ]);

    expect(result.latestVersion).toStrictEqual(O.some(date));
  });

  it('returns the latest activity date', () => {
    const date = arbitraryDate();
    const result = articleMetaTagContent([
      pipe(RFI.arbitrary(), RFI.withDate(date)),
      pipe(RFI.arbitrary(), RFI.withDate(new Date('01-01-1970'))),
    ]);

    expect(result.latestActivity).toStrictEqual(O.some(date));
  });
});
