import { URL } from 'url';
import * as O from 'fp-ts/lib/Option';
import clip from 'text-clipper';
import { Maybe } from 'true-myth';
import { RenderReviewResponses } from './render-review-responses';
import templateDate from '../shared-components/date';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { ReviewId } from '../types/review-id';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';
import { UserId } from '../types/user-id';

export type RenderReviewFeedItem = (review: ReviewFeedItem, userId: O.Option<UserId>) => Promise<HtmlFragment>;

export type ReviewFeedItem = {
  type: 'review';
  id: ReviewId;
  source: URL;
  occurredAt: Date;
  editorialCommunityId: EditorialCommunityId;
  editorialCommunityName: string;
  editorialCommunityAvatar: URL;
  fullText: Maybe<SanitisedHtmlFragment>;
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

const renderWithText = (teaserChars: number, review: ReviewFeedItem) => (responses: HtmlFragment): HtmlFragment => {
  const fullText = review.fullText.unsafelyUnwrap();
  const teaserText = clip(fullText, teaserChars);
  if (teaserText === fullText) {
    return toHtmlFragment(`
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
    `);
  }
  // TODO: a review.id containing dodgy chars could break this
  return toHtmlFragment(`
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
  `);
};

export default (
  teaserChars: number,
  renderReviewResponses: RenderReviewResponses,
): RenderReviewFeedItem => async (review, userId) => {
  const responses = await renderReviewResponses(review.id, userId)();
  if (review.fullText.isNothing()) {
    return toHtmlFragment(`
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
    `);
  }
  return renderWithText(teaserChars, review)(responses);
};
