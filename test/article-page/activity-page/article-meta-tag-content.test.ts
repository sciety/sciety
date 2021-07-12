import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as RFI from './review-feed-item.helper';
import { articleMetaTagContent } from '../../../src/article-page/activity-page/article-meta-tag-content';
import { arbitraryDate, arbitraryNumber, arbitraryUri } from '../../helpers';

const arbitraryArticleVersionFeedItem = (occurredAt: Date = arbitraryDate()) => ({
  type: 'article-version' as const,
  source: new URL(arbitraryUri()),
  occurredAt,
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

  it('returns a latest version', () => {
    const date = arbitraryDate();
    const result = articleMetaTagContent([
      arbitraryArticleVersionFeedItem(date),
      arbitraryArticleVersionFeedItem(new Date('01-01-1970')),
    ]);

    expect(result.latestVersion).toStrictEqual(O.some(date));
  });

  it.todo('ordering coupling problem');
});
