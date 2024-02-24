import { URL } from 'url';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { EvaluationPublishedFeedItem } from '../../../src/html-pages/paper-activity-page/view-model.js';
import { toHtmlFragment } from '../../../src/types/html-fragment.js';
import { sanitise } from '../../../src/types/sanitised-html-fragment.js';
import { arbitraryString, arbitraryUri, arbitraryWord } from '../../helpers.js';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper.js';

export const arbitrary = (): EvaluationPublishedFeedItem => ({
  type: 'evaluation-published',
  id: arbitraryEvaluationLocator(),
  sourceHref: O.some(new URL(arbitraryUri())),
  publishedAt: new Date(),
  groupHref: arbitraryWord(),
  groupName: 'group 1',
  groupAvatar: '/avatar',
  fullText: pipe(arbitraryString(), toHtmlFragment, sanitise, O.some),
  fullTextLanguageCode: O.none,
});

export const withFullText = (fullText: string) => (rfi: EvaluationPublishedFeedItem): EvaluationPublishedFeedItem => ({
  ...rfi,
  fullText: pipe(fullText, toHtmlFragment, sanitise, O.some),
});

export const withNoFullText = (rfi: EvaluationPublishedFeedItem): EvaluationPublishedFeedItem => ({
  ...rfi,
  fullText: O.none,
});

export const withSource = (uri: string) => (rfi: EvaluationPublishedFeedItem): EvaluationPublishedFeedItem => ({
  ...rfi,
  sourceHref: O.some(new URL(uri)),
});

export const withNoSource = (rfi: EvaluationPublishedFeedItem): EvaluationPublishedFeedItem => ({
  ...rfi,
  sourceHref: O.none,
});

export const withDate = (publishedAt: Date) => (rfi: EvaluationPublishedFeedItem): EvaluationPublishedFeedItem => ({
  ...rfi,
  publishedAt,
});
