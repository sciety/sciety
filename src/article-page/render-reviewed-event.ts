import { URL } from 'url';
import clip from 'text-clipper';
import { Maybe } from 'true-myth';
import templateDate from '../templates/date';
import EditorialCommunityId from '../types/editorial-community-id';

export type RenderReviewedEvent = (review: Review) => string;

export type Review = {
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
): RenderReviewedEvent => (review: Review): string => `
  <li class="article-feed__item">
    ${renderAvatar(review.editorialCommunityAvatar)}
    <div class="article-feed__item_body" data-behaviour="collapse_to_teaser">
      ${templateDate(review.occurredAt, 'article-feed__item__date')}
      <div class="article-feed__item__title">
        Reviewed by
        <a href="/editorial-communities/${review.editorialCommunityId.value}">
          ${review.editorialCommunityName}
        </a>
      </div>

      <div class="hidden" data-teaser>
        ${clip(review.fullText.or(Maybe.just('')).unsafelyUnwrap(), teaserChars)}
      </div>
      <div data-full-text>
        ${review.fullText.or(Maybe.just('')).unsafelyUnwrap()}
        <a href="${review.source.toString()}" class="article-feed__item__read_more article-call-to-action-link">
          Read the original source
        </a>
      </div>

    </div>
  </li>
`;
