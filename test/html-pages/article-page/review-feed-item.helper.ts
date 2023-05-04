import { URL } from 'url';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { ReviewFeedItem } from '../../../src/html-pages/article-page/view-model';
import { toHtmlFragment } from '../../../src/types/html-fragment';
import { sanitise } from '../../../src/types/sanitised-html-fragment';
import { arbitraryString, arbitraryUri, arbitraryWord } from '../../helpers';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';

export const arbitrary = (): ReviewFeedItem => ({
  type: 'review',
  id: arbitraryEvaluationLocator(),
  source: O.some(new URL(arbitraryUri())),
  publishedAt: new Date(),
  groupHref: arbitraryWord(),
  groupName: 'group 1',
  groupAvatar: '/avatar',
  fullText: pipe(arbitraryString(), toHtmlFragment, sanitise, O.some),
  responses: O.some({
    counts: { helpfulCount: 0, notHelpfulCount: 0 },
    current: O.none,
  }),
});

export const withFullText = (fullText: string) => (rfi: ReviewFeedItem): ReviewFeedItem => ({
  ...rfi,
  fullText: pipe(fullText, toHtmlFragment, sanitise, O.some),
});

export const withNoFullText = (rfi: ReviewFeedItem): ReviewFeedItem => ({
  ...rfi,
  fullText: O.none,
});

export const withSource = (uri: string) => (rfi: ReviewFeedItem): ReviewFeedItem => ({
  ...rfi,
  source: O.some(new URL(uri)),
});

export const withNoSource = (rfi: ReviewFeedItem): ReviewFeedItem => ({
  ...rfi,
  source: O.none,
});

export const withDate = (publishedAt: Date) => (rfi: ReviewFeedItem): ReviewFeedItem => ({
  ...rfi,
  publishedAt,
});
