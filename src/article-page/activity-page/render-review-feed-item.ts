import { URL } from 'url';
import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import { constant, flow, pipe } from 'fp-ts/function';
import clip from 'text-clipper';
import { renderReviewResponses } from './render-review-responses';
import { templateDate } from '../../shared-components/date';
import { ReviewIdFromString as RIcodec } from '../../types/codecs/ReviewIdFromString';
import { GroupId } from '../../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import * as RI from '../../types/review-id';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';

type RenderReviewFeedItem = (review: ReviewFeedItem) => HtmlFragment;

export type ReviewFeedItem = {
  type: 'review',
  id: RI.ReviewId,
  source: O.Option<URL>,
  occurredAt: Date,
  groupId: GroupId,
  groupName: string,
  groupAvatar: string,
  fullText: O.Option<SanitisedHtmlFragment>,
  counts: { helpfulCount: number, notHelpfulCount: number },
  current: O.Option<'helpful' | 'not-helpful'>,
};

const avatar = (review: ReviewFeedItem) => toHtmlFragment(`
  <img class="activity-feed__item__avatar" src="${review.groupAvatar}" alt="">
`);

const eventMetadata = (review: ReviewFeedItem) => toHtmlFragment(`
  <div class="activity-feed__item__meta">
    <div class="activity-feed__item__title">
      <a href="/groups/${review.groupId.value}">
        ${htmlEscape(review.groupName)}
      </a>
    </div>
    ${templateDate(review.occurredAt, 'activity-feed__item__date')}
  </div>
`);

const sourceLink = flow(
  (review: ReviewFeedItem) => review.source,
  O.map(flow(
    (source) => `
      <a href="${source.toString()}" class="activity-feed__item__read_more">
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
      <article class="activity-feed__item_contents" id="${RIcodec.encode(review.id)}">
        <header class="activity-feed__item_header">
          ${avatar(review)}
          ${eventMetadata(review)}
        </header>
        <div class="activity-feed__item_body">
          <div>
            ${fullText}
            ${pipe(review, sourceLink, O.getOrElse(constant('')))}
          </div>
        </div>
      </article>
      ${responses}
    `;
  }
  // TODO: a review.id containing dodgy chars could break this
  return `
    <article class="activity-feed__item_contents" id="${RIcodec.encode(review.id)}">
      <header class="activity-feed__item_header">
        ${avatar(review)}
        ${eventMetadata(review)}
      </header>
      <div class="activity-feed__item_body" data-behaviour="collapse_to_teaser">
        <div class="hidden" data-teaser>
          ${teaserText}
        </div>
        <div data-full-text>
          ${fullText}
          ${pipe(review, sourceLink, O.getOrElse(constant('')))}
        </div>
      </div>
    </article>
    ${responses}
  `;
};

const render = (teaserChars: number, review: ReviewFeedItem, responses: HtmlFragment) => pipe(
  review.fullText,
  O.fold(
    () => `
      <article class="activity-feed__item_contents" id="${RIcodec.encode(review.id)}">
        <header class="activity-feed__item_header">
          ${avatar(review)}
          ${eventMetadata(review)}
        </header>
        <div class="activity-feed__item_body">
          <div>
            ${pipe(review, sourceLink, O.getOrElse(constant('')))}
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
  (review) => render(teaserChars, review, renderReviewResponses({ ...review, reviewId: review.id })),
  toHtmlFragment,
);
