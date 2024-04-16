import { URL } from 'url';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { feedSummary } from '../../../../src/html-pages/paper-activity-page/construct-view-model/feed-summary';
import { ExpressionPublishedFeedItem } from '../../../../src/html-pages/paper-activity-page/view-model';
import { arbitraryDate, arbitraryString, arbitraryUri } from '../../../helpers';
import { arbitraryExpressionDoi } from '../../../types/expression-doi.helper';
import * as RFI from '../evaluation-feed-item.helper';

const arbitraryPaperExpressionFeedItem = (publishedAt: Date = arbitraryDate()): ExpressionPublishedFeedItem => ({
  type: 'expression-published' as const,
  source: new URL(arbitraryUri()),
  publishedAt,
  server: O.some('biorxiv' as const),
  doi: arbitraryExpressionDoi(),
  publishedTo: arbitraryString(),
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
      arbitraryPaperExpressionFeedItem(),
    ]);

    expect(result.evaluationCount).toBe(0);
  });

  it('returns a latest version', () => {
    const date = arbitraryDate();
    const result = feedSummary([
      arbitraryPaperExpressionFeedItem(date),
      arbitraryPaperExpressionFeedItem(new Date('01-01-1970')),
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
