import { URL } from 'url';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { feedSummary } from '../../../../src/html-pages/article-page/construct-view-model/feed-summary.js';
import { arbitraryDate, arbitraryNumber, arbitraryUri } from '../../../helpers.js';
import * as RFI from '../evaluation-feed-item.helper.js';

const arbitraryArticleVersionFeedItem = (publishedAt: Date = arbitraryDate()) => ({
  type: 'article-version' as const,
  source: new URL(arbitraryUri()),
  publishedAt,
  version: arbitraryNumber(1, 10),
  server: 'biorxiv' as const,
});

describe('article-meta-tag-content', () => {
  it('returns a count of the evaluations', () => {
    const result = feedSummary([
      RFI.arbitrary(),
      RFI.arbitrary(),
    ]);

    expect(result.evaluationCount).toBe(2);
  });

  it('ignores non-evaluation feed items', () => {
    const result = feedSummary([
      arbitraryArticleVersionFeedItem(),
    ]);

    expect(result.evaluationCount).toBe(0);
  });

  it('returns a latest version', () => {
    const date = arbitraryDate();
    const result = feedSummary([
      arbitraryArticleVersionFeedItem(date),
      arbitraryArticleVersionFeedItem(new Date('01-01-1970')),
    ]);

    expect(result.latestVersion).toStrictEqual(O.some(date));
  });

  it('returns the latest activity date', () => {
    const date = arbitraryDate();
    const result = feedSummary([
      pipe(RFI.arbitrary(), RFI.withDate(date)),
      pipe(RFI.arbitrary(), RFI.withDate(new Date('01-01-1970'))),
    ]);

    expect(result.latestActivity).toStrictEqual(O.some(date));
  });
});
