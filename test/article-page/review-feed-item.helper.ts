import { URL } from 'url';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { ReviewFeedItem } from '../../src/article-page/render-review-feed-item';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { sanitise } from '../../src/types/sanitised-html-fragment';
import * as t from '../helpers';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';

export const arbitrary = (): ReviewFeedItem => ({
  type: 'review',
  id: arbitraryDoi(),
  source: O.some(new URL(t.arbitraryUri())),
  occurredAt: new Date(),
  groupId: arbitraryGroupId(),
  groupName: 'group 1',
  groupAvatar: '/avatar',
  fullText: pipe(t.arbitraryString(), toHtmlFragment, sanitise, O.some),
  counts: {
    helpfulCount: 0,
    notHelpfulCount: 0,
  },
  current: O.none,
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
