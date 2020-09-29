import { URL } from 'url';
import { Result } from 'true-myth';
import templateDate from '../templates/date';
import Doi from '../types/doi';
import EditorialCommunityId from '../types/editorial-community-id';

type RenderFeed = (doi: Doi) => Promise<Result<string, never>>;

const renderAvatar = (url: URL): string => `
  <img class="article-feed__item__avatar" src="${url.toString()}" alt="">
`;

export type Review = {
  sourceUrl: URL;
  publicationDate: Date;
  editorialCommunityId: EditorialCommunityId;
  editorialCommunityName: string;
  editorialCommunityAvatar: URL;
  details: string;
};

export type GetReviews = (doi: Doi) => Promise<ReadonlyArray<Review>>;

export default (getReviews: GetReviews): RenderFeed => async (doi) => {
  const reviews = await getReviews(doi);
  const renderItem = (review: Review): string => `
      <li class="article-feed__item">
        ${renderAvatar(review.editorialCommunityAvatar)}
        <div>
          ${templateDate(review.publicationDate, 'article-feed__item__date')}
          <div class="article-feed__item__title">
                      Reviewed by
            <a href="/editorial-communities/${review.editorialCommunityId.value}">
              ${review.editorialCommunityName}
            </a>
            </div>
          <details>
          ${review.details}
          <a href="${review.sourceUrl.toString()}" class="article-feed__item__read_more article-call-to-action-link">
            Read the original source
          </a>
          </details>
        </div>
      </li>
    `;

  if (doi.value === '10.1101/646810') {
    const feed = `
  <section>
    <h2>Feed</h2>

    <ol role="list" class="article-feed">

      ${renderItem(reviews[0])}
      ${renderItem(reviews[1])}
      ${renderItem(reviews[2])}

    </ol>
  </section>
    `;
    return Promise.resolve(Result.ok(feed));
  }
  return Promise.resolve(Result.ok(''));
};
