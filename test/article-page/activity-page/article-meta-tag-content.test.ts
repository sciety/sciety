import { URL } from 'url';
import * as RFI from './review-feed-item.helper';
import { articleMetaTagContent } from '../../../src/article-page/activity-page/article-meta-tag-content';
import { arbitraryDate, arbitraryNumber, arbitraryUri } from '../../helpers';

const arbitraryArticleVersionFeedItem = () => ({
  type: 'article-version' as const,
  source: new URL(arbitraryUri()),
  occurredAt: arbitraryDate(),
  version: arbitraryNumber(1, 10),
  server: 'biorxiv' as const,
});

describe('article-meta-tag-content', () => {
  it('returns a count of the evaluations', () => {
    const result = articleMetaTagContent([
      RFI.arbitrary(),
      RFI.arbitrary(),
    ]);

    expect(result.evaluationCount).toStrictEqual(2);
  });

  it('ignores non-evaluation feed items', () => {
    const result = articleMetaTagContent([
      arbitraryArticleVersionFeedItem(),
    ]);

    expect(result.evaluationCount).toStrictEqual(0);
  });
});
