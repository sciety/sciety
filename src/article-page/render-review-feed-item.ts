import { URL } from 'url';
import * as O from 'fp-ts/lib/Option';
import clip from 'text-clipper';
import { Maybe } from 'true-myth';
import { RenderReviewResponses } from './render-review-responses';
import templateDate from '../shared-components/date';
import EditorialCommunityId from '../types/editorial-community-id';
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

const renderAvatar = (url: URL): string => toHtmlFragment(`
  <img class="article-feed__item__avatar" src="${url.toString()}" alt="">
`);

export default (
  teaserChars: number,
  renderReviewResponses: RenderReviewResponses,
): RenderReviewFeedItem => async (review, userId) => {
  const reviewResponsesHtml = await renderReviewResponses(review.id, userId);
  const eventMetadata = toHtmlFragment(`
    ${templateDate(review.occurredAt, 'article-feed__item__date')}
    <div class="article-feed__item__title">
      Reviewed by
      <a href="/editorial-communities/${review.editorialCommunityId.value}">
        ${review.editorialCommunityName}
      </a>
    </div>
  `);
  const sourceLink = toHtmlFragment(`
    <a href="${review.source.toString()}" class="article-feed__item__read_more article-call-to-action-link">
      Read the original source
    </a>
  `);
  if (review.fullText.isNothing()) {
    return toHtmlFragment(`
      <div class="article-feed__item_contents">
        ${renderAvatar(review.editorialCommunityAvatar)}
        <div class="article-feed__item_body">
          ${eventMetadata}
          <div>
            ${sourceLink}
          </div>
        </div>
      </div>
      ${reviewResponsesHtml}
    `);
  }

  const fullText = review.fullText.unsafelyUnwrap();
  const teaserText = clip(fullText, teaserChars);
  if (teaserText === fullText) {
    return toHtmlFragment(`
      <div class="article-feed__item_contents">
        ${renderAvatar(review.editorialCommunityAvatar)}
        <div class="article-feed__item_body">
          ${eventMetadata}
          <div>
            ${fullText}
            ${sourceLink}
          </div>
        </div>
      </div>
      ${reviewResponsesHtml}
    `);
  }
  return toHtmlFragment(`
    <div class="article-feed__item_contents" id="${review.id.toString()}">
      ${renderAvatar(review.editorialCommunityAvatar)}
      <div class="article-feed__item_body" data-behaviour="collapse_to_teaser">
        ${eventMetadata}
        <div class="hidden" data-teaser>
          ${teaserText}
        </div>
        <div data-full-text>
          ${fullText}
          ${sourceLink}
        </div>
      </div>
    </div>
    ${reviewResponsesHtml}
  `);
};
