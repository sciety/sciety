import { URL } from 'url';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { feedSummary } from '../../../../src/html-pages/paper-activity-page/construct-view-model/feed-summary';
import { arbitraryDate, arbitraryUri } from '../../../helpers';
import * as RFI from '../evaluation-feed-item.helper';
import { PaperExpressionFeedItem } from '../../../../src/html-pages/paper-activity-page/view-model';
import { arbitraryExpressionDoi } from '../../../types/expression-doi.helper';

const arbitraryPaperExpressionFeedItem = (publishedAt: Date = arbitraryDate()): PaperExpressionFeedItem => ({
  type: 'paper-expression' as const,
  source: new URL(arbitraryUri()),
  publishedAt,
  server: O.some('biorxiv' as const),
  doi: arbitraryExpressionDoi(),
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
