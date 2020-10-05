import { URL } from 'url';
import { Result } from 'true-myth';
import { RenderReviewedEvent, Review } from './render-reviewed-event';
import renderDate from '../templates/date';
import renderListItems from '../templates/list-items';
import Doi from '../types/doi';

type RenderFeed = (doi: Doi) => Promise<Result<string, 'no-content'>>;

export type GetReviews = (doi: Doi) => Promise<ReadonlyArray<Review>>;

export default (
  getReviews: GetReviews,
  renderReviewedEvent: RenderReviewedEvent,
): RenderFeed => async (doi) => {
  const reviews = await getReviews(doi);

  if (reviews.length === 0) {
    return Result.err('no-content');
  }

  const items = reviews.map(renderReviewedEvent);

  if (doi.value === '10.1101/646810') {
    type ArticleVersionFeedItem = {
      source: URL;
      postedAt: Date;
      version: number;
    };
    const renderVersionEvent = (feedItem: ArticleVersionFeedItem): string => `
      <img class="article-feed__item__avatar" src="https://pbs.twimg.com/profile_images/956882186996662272/lwyH1HFe_200x200.jpg" alt="">
      <div>
        ${renderDate(feedItem.postedAt, 'article-feed__item__date')}
        <p class="article-feed__item__title">
          <a href="${feedItem.source.toString()}">
            Version ${feedItem.version} published on bioRxiv
          </a>
        </p>
      </div>
    `;
    items.push(renderVersionEvent({
      source: new URL('https://www.biorxiv.org/content/10.1101/646810v1?versioned=true'),
      postedAt: new Date('2019-05-24'),
      version: 1,
    }));
  }

  return Result.ok(`
    <section>
      <h2>Feed</h2>

      <ol role="list" class="article-feed">
        ${renderListItems(items, 'article-feed__item')}
      </ol>
    </section>
  `);
};
