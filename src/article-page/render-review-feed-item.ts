import { URL } from 'url';
import clip from 'text-clipper';
import { Maybe } from 'true-myth';
import { RenderVotes } from './render-votes';
import templateDate from '../shared-components/date';
import EditorialCommunityId from '../types/editorial-community-id';
import { ReviewId } from '../types/review-id';
import { UserId } from '../types/user-id';

export type RenderReviewFeedItem = (review: ReviewFeedItem, userId: Maybe<UserId>) => Promise<string>;

export type ReviewFeedItem = {
  type: 'review';
  id: ReviewId;
  source: URL;
  occurredAt: Date;
  editorialCommunityId: EditorialCommunityId;
  editorialCommunityName: string;
  editorialCommunityAvatar: URL;
  fullText: Maybe<string>;
};

const renderAvatar = (url: URL): string => `
  <img class="article-feed__item__avatar" src="${url.toString()}" alt="">
`;

export default (
  teaserChars: number,
  renderVotes: RenderVotes,
): RenderReviewFeedItem => async (review, userId) => {
  let votesHtml = '';
  if (process.env.EXPERIMENT_ENABLED === 'true') {
    votesHtml = await renderVotes(review.id, userId);
  }
  const eventMetadata = `
    ${templateDate(review.occurredAt, 'article-feed__item__date')}
    <div class="article-feed__item__title">
      Reviewed by
      <a href="/editorial-communities/${review.editorialCommunityId.value}">
        ${review.editorialCommunityName}
      </a>
    </div>
  `;
  const sourceLink = `
    <a href="${review.source.toString()}" class="article-feed__item__read_more article-call-to-action-link">
      Read the original source
    </a>
  `;
  if (review.fullText.isNothing()) {
    return `
      <div class="article-feed__item_contents">
        ${renderAvatar(review.editorialCommunityAvatar)}
        <div class="article-feed__item_body">
          ${eventMetadata}
          <div>
            ${sourceLink}
          </div>
        </div>
      </div>
      ${votesHtml}
    `;
  }

  const fullText = review.fullText.unsafelyUnwrap();
  const teaserText = clip(fullText, teaserChars);
  if (teaserText === fullText) {
    return `
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
      ${votesHtml}
    `;
  }
  return `
    <div class="article-feed__item_contents">
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
    ${votesHtml}
  `;
};
