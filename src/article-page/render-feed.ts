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
          function buildToggle() {
            const button = doc.createElement('button');
            button.classList.add('article-feed__item-toggle');
            return button;
          }
          const itemBodies = doc.querySelectorAll('.article-feed__item_body');
          Array.prototype.forEach.call(itemBodies, function (itemBody) {
            const teaser = itemBody.querySelector('[data-teaser]');
            const fullText = itemBody.querySelector('[data-full-text]');

            const toggle = buildToggle();
            itemBody.insertBefore(toggle, fullText);

            teaser.classList.remove('hidden');
            fullText.classList.add('hidden');
            toggle.innerHTML = 'See more <span aria-hidden="true">+</span>';

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
