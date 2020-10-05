import { Result } from 'true-myth';
import { RenderReviewedEvent, Review } from './render-reviewed-event';
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

  let items = reviews.map(renderReviewedEvent).join('\n');

  if (doi.value === '10.1101/646810') {
    items += `
      <li class="article-feed__item">
        <img class="article-feed__item__avatar" src="https://pbs.twimg.com/profile_images/956882186996662272/lwyH1HFe_200x200.jpg" alt="">
        <div>
          <time class="article-feed__item__date" datetime="2019-05-24">May 24, 2019</time>
          <p class="article-feed__item__title">
            <a href="https://www.biorxiv.org/content/10.1101/646810v1?versioned=true">
              Version 1 published on bioRxiv
            </a>
          </p>
        </div>
      </li>
    `;
  }

  return Result.ok(`
    <section>
      <h2>Feed</h2>

      <ol role="list" class="article-feed">
        ${items}
      </ol>
    </section>
  `);
};
