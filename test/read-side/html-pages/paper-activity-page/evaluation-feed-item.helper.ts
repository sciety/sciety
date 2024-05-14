import { URL } from 'url';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { EvaluationPublishedFeedItem } from '../../../../src/read-side/html-pages/paper-activity-page/view-model';
import { toHtmlFragment } from '../../../../src/types/html-fragment';
import { sanitise } from '../../../../src/types/sanitised-html-fragment';
import {
  arbitraryString, arbitraryUrl, arbitraryWord,
} from '../../../helpers';
import { arbitraryEvaluationLocator } from '../../../types/evaluation-locator.helper';

export const arbitrary = (): EvaluationPublishedFeedItem => ({
  type: 'evaluation-published',
  id: arbitraryEvaluationLocator(),
  sourceHref: O.some(arbitraryUrl()),
  publishedAt: new Date(),
  groupHref: arbitraryWord(),
  groupName: 'group 1',
  groupAvatarSrc: '/avatar',
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
