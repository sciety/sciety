import { URL } from 'url';
import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { flow, pipe } from 'fp-ts/lib/function';
import clip from 'text-clipper';
import { RenderReviewResponses } from './render-review-responses';
import templateDate from '../shared-components/date';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { ReviewId } from '../types/review-id';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';
import { UserId } from '../types/user-id';

export type RenderReviewFeedItem = (review: ReviewFeedItem, userId: O.Option<UserId>) => T.Task<HtmlFragment>;

export type ReviewFeedItem = {
  type: 'review';
  id: ReviewId;
  source: URL;
  occurredAt: Date;
  editorialCommunityId: EditorialCommunityId;
  editorialCommunityName: string;
  editorialCommunityAvatar: URL;
  fullText: O.Option<SanitisedHtmlFragment>;
};

const avatar = (review: ReviewFeedItem): HtmlFragment => toHtmlFragment(`
  <img class="article-feed__item__avatar" src="${review.editorialCommunityAvatar.toString()}" alt="">
`);

const eventMetadata = (review: ReviewFeedItem): HtmlFragment => toHtmlFragment(`
  ${templateDate(review.occurredAt, 'article-feed__item__date')}
  <div class="article-feed__item__title">
    ${(review.editorialCommunityId.value === 'f97bd177-5cb6-4296-8573-078318755bf2') ? 'Highlighted by' : 'Reviewed by'}
    <a href="/editorial-communities/${review.editorialCommunityId.value}">
      ${review.editorialCommunityName}
    </a>
  </div>
`);

const sourceLink = (review: ReviewFeedItem): HtmlFragment => toHtmlFragment(`
  <a href="${review.source.toString()}" class="article-feed__item__read_more article-call-to-action-link">
    Read the original source
  </a>
`);

type RenderWithText = (
  teaserChars: number,
  review: ReviewFeedItem,
  fullText: string,
) => (responses: HtmlFragment) => string;

const renderWithText: RenderWithText = (teaserChars, review, fullText) => (responses) => {
  const teaserText = clip(fullText, teaserChars);
  if (teaserText === fullText) {
    return `
      <div class="article-feed__item_contents">
        ${avatar(review)}
        <div class="article-feed__item_body">
          ${eventMetadata(review)}
          <div>
            ${fullText}
            ${sourceLink(review)}
          </div>
        </div>
      </div>
      ${responses}
    `;
  }
  // TODO: a review.id containing dodgy chars could break this
  return `
    <div class="article-feed__item_contents" id="${review.id.toString()}">
      ${avatar(review)}
      <div class="article-feed__item_body" data-behaviour="collapse_to_teaser">
        ${eventMetadata(review)}
        <div class="hidden" data-teaser>
          ${teaserText}
        </div>
        <div data-full-text>
          ${fullText}
          ${sourceLink(review)}
        </div>
      </div>
    </div>
    ${responses}
  `;
};

const render = (teaserChars: number, review: ReviewFeedItem) => (responses: HtmlFragment): string => pipe(
  review.fullText,
  O.fold(
    () => `
      <div class="article-feed__item_contents">
        ${avatar(review)}
        <div class="article-feed__item_body">
          ${eventMetadata(review)}
          <div>
            ${sourceLink(review)}
          </div>
        </div>
      </div>
      ${responses}
    `,
    (fullText) => renderWithText(teaserChars, review, fullText)(responses),
  ),
);

export const createRenderReviewFeedItem = (
  teaserChars: number,
  renderReviewResponses: RenderReviewResponses,
): RenderReviewFeedItem => (review, userId) => pipe(
  renderReviewResponses(review.id, userId),
  T.map(flow(
    render(teaserChars, review),
    toHtmlFragment,
  )),
);
