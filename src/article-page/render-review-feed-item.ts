import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { constant, flow, pipe } from 'fp-ts/function';
import clip from 'text-clipper';
import { templateDate } from '../shared-components';
import { GroupId } from '../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { ReviewId, toString } from '../types/review-id';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';
import { UserId } from '../types/user-id';

export type RenderReviewFeedItem = (review: ReviewFeedItem, userId: O.Option<UserId>) => T.Task<HtmlFragment>;

type RenderReviewResponses = (reviewId: ReviewId, userId: O.Option<UserId>) => T.Task<HtmlFragment>;

export type ReviewFeedItem = {
  type: 'review',
  id: ReviewId,
  source: O.Option<URL>,
  occurredAt: Date,
  editorialCommunityId: GroupId,
  editorialCommunityName: string,
  editorialCommunityAvatar: string,
  fullText: O.Option<SanitisedHtmlFragment>,
};

const avatar = (review: ReviewFeedItem) => toHtmlFragment(`
  <img class="activity-feed__item__avatar" src="${review.editorialCommunityAvatar}" alt="">
`);

const eventMetadata = (review: ReviewFeedItem) => toHtmlFragment(`
  <div class="activity-feed__item__meta">
    <div class="activity-feed__item__title">
      ${(review.editorialCommunityId.value === 'f97bd177-5cb6-4296-8573-078318755bf2') ? 'Highlighted by' : 'Reviewed by'}
      <a href="/groups/${review.editorialCommunityId.value}">
        ${review.editorialCommunityName}
      </a>
    </div>
    ${templateDate(review.occurredAt, 'activity-feed__item__date')}
  </div>
`);

const sourceLink = (review: ReviewFeedItem) => pipe(
  review.source,
  O.map(
    (source) => `<a href="${source.toString()}" class="activity-feed__item__read_more">
    Read the original source
  </a>`,
  ),
  O.map(toHtmlFragment),
);

const renderWithText = (teaserChars: number, review: ReviewFeedItem, fullText: string) => (responses: HtmlFragment) => {
  const teaserText = clip(fullText, teaserChars);
  if (teaserText === fullText) {
    return `
      <article class="activity-feed__item_contents" id="${toString(review.id)}">
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
    <article class="activity-feed__item_contents" id="${toString(review.id)}">
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

const render = (teaserChars: number, review: ReviewFeedItem) => (responses: HtmlFragment) => pipe(
  review.fullText,
  O.fold(
    () => `
      <article class="activity-feed__item_contents" id="${toString(review.id)}">
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
  renderReviewResponses: RenderReviewResponses,
): RenderReviewFeedItem => (review, userId) => pipe(
  renderReviewResponses(review.id, userId),
  T.map(flow(
    // TODO: remove the currying
    render(teaserChars, review),
    toHtmlFragment,
  )),
);
