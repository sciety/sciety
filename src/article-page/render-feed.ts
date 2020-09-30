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

  const items = reviews.map(renderReviewedEvent).join('\n');

  return Result.ok(`
    <section>
      <h2>Feed</h2>

      <ol role="list" class="article-feed">
        ${items}
      </ol>
      <script>
        (function(doc) {
          const toggles = doc.querySelectorAll('.article-feed__item-toggle');
          Array.prototype.forEach.call(toggles, function (toggle) {
            const teaser = toggle.parentElement.querySelector('[data-teaser]');
            const fullText = toggle.parentElement.querySelector('[data-full-text]');
            toggle.addEventListener('click', function (e) {
              const target = e.target;
              if (target.innerHTML.indexOf('See more') > -1) {
                teaser.classList.add('hidden');
                fullText.classList.remove('hidden');
                target.innerHTML = 'See less <span aria-hidden="true">-</span>';
              } else {
                teaser.classList.remove('hidden');
                fullText.classList.add('hidden');
                target.innerHTML = 'See more <span aria-hidden="true">+</span>';
              }
            })
          });
        }(window.document));
      </script>
    </section>
  `);
};
