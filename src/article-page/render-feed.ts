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
            toggle.addEventListener('click', function (e) {
              const target = e.target;
              const teaser = target.parentElement.querySelector('[data-teaser]');
              const fullText = target.parentElement.querySelector('[data-full-text]');
              if (target.innerHTML.indexOf('See more') > -1) {
                teaser.style.display = 'none';
                fullText.style.display = 'block';
                target.innerHTML = 'See less <span aria-hidden="true">-</span>';
              } else {
                  teaser.style.display = 'block';
                fullText.style.display = 'none';
                target.innerHTML = 'See more <span aria-hidden="true">+</span>';
              }
            })
          });
        }(window.document));
      </script>
    </section>
  `);
};
