import { URL } from 'url';
import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import { constant, flow, pipe } from 'fp-ts/function';
import clip from 'text-clipper';
import { detect } from 'tinyld';
import { renderReviewResponses } from './render-review-responses';
import { missingFullTextAndSourceLink } from './static-messages';
import { templateDate } from '../../shared-components/date';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import * as RI from '../../types/review-id';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';

type RenderReviewFeedItem = (review: ReviewFeedItem) => HtmlFragment;

export type ReviewFeedItem = {
  type: 'review',
  id: RI.ReviewId,
  source: O.Option<URL>,
  publishedAt: Date,
  groupName: string,
  groupHref: string,
  groupAvatar: string,
  fullText: O.Option<SanitisedHtmlFragment>,
  counts: { helpfulCount: number, notHelpfulCount: number },
  current: O.Option<'helpful' | 'not-helpful'>,
};

const inferLanguageCode = (text: string): string => {
  const code = detect(text, { only: ['en', 'es', 'pt'] });
  return code === '' ? '' : ` lang="${code}"`;
};

const avatar = (review: ReviewFeedItem) => toHtmlFragment(`
  <img class="activity-feed__item__avatar" src="${review.groupAvatar}" alt="">
`);

const eventMetadata = (review: ReviewFeedItem) => toHtmlFragment(`
  <div class="activity-feed__item__meta">
    <div class="activity-feed__item__title">
      <a href="${review.groupHref}">
        ${htmlEscape(review.groupName)}
      </a>
    </div>
    ${templateDate(review.publishedAt, 'activity-feed__item__date')}
  </div>
`);

const sourceLink = flow(
  (review: ReviewFeedItem) => review.source,
  O.map(flow(
    (source) => `
      <a href="${source.toString()}" class="activity-feed__item__read_original_source">
        Read the original source
      </a>
    `,
    toHtmlFragment,
  )),
);

const renderWithText = (teaserChars: number, review: ReviewFeedItem, fullText: string) => (responses: HtmlFragment) => {
  const teaserText = clip(fullText, teaserChars, { html: true });
  if (teaserText === fullText) {
    return `
      <article class="activity-feed__item__contents" id="${RI.reviewIdCodec.encode(review.id)}">
        <header class="activity-feed__item__header">
          ${avatar(review)}
          ${eventMetadata(review)}
        </header>
        <div class="activity-feed__item__body">
          <div>
            <div${inferLanguageCode(fullText)}>${fullText}</div>
            ${pipe(review, sourceLink, O.getOrElse(constant('')))}
          </div>
        </div>
      </article>
      ${responses}
    `;
  }
  // TODO: a review.id containing dodgy chars could break this
  return `
    <article class="activity-feed__item__contents" id="${RI.reviewIdCodec.encode(review.id)}">
      <header class="activity-feed__item__header">
        ${avatar(review)}
        ${eventMetadata(review)}
      </header>
      <div class="activity-feed__item__body" data-behaviour="collapse_to_teaser">
        <div class="hidden" data-teaser${inferLanguageCode(fullText)}>
          ${teaserText}
        </div>
        <div data-full-text>
          <div${inferLanguageCode(fullText)}>${fullText}</div>
          ${pipe(review, sourceLink, O.getOrElse(constant('')))}
        </div>
      </div>
    </article>
    ${responses}
  `;
};

const renderSourceLinkWhenFulltextMissing = (review: ReviewFeedItem) => pipe(
  review,
  sourceLink,
  O.getOrElse(constant(missingFullTextAndSourceLink)),
);

const render = (teaserChars: number, review: ReviewFeedItem, responses: HtmlFragment) => pipe(
  review.fullText,
  O.fold(
    () => `
      <article class="activity-feed__item__contents" id="${RI.reviewIdCodec.encode(review.id)}">
        <header class="activity-feed__item__header">
          ${avatar(review)}
          ${eventMetadata(review)}
        </header>
        <div class="activity-feed__item__body">
          <div>
            ${renderSourceLinkWhenFulltextMissing(review)}
          </div>
        </div>
      </article>
      ${responses}
    `,
    (fullText) => renderWithText(teaserChars, review, fullText)(responses),
  ),
);

export const renderReviewFeedItem = (
  teaserChars: number,
): RenderReviewFeedItem => flow(
  (review) => render(teaserChars, review, renderReviewResponses({ ...review, evaluationLocator: review.id })),
  toHtmlFragment,
);
