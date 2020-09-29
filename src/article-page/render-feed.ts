import { URL } from 'url';
import clip from 'text-clipper';
import { Result } from 'true-myth';
import templateDate from '../templates/date';
import Doi from '../types/doi';
import EditorialCommunityId from '../types/editorial-community-id';

type RenderFeed = (doi: Doi) => Promise<Result<string, 'no-content'>>;

const renderAvatar = (url: URL): string => `
  <img class="article-feed__item__avatar" src="${url.toString()}" alt="">
`;

type Review = {
  sourceUrl: URL;
  publicationDate: Date;
  editorialCommunityId: EditorialCommunityId;
  editorialCommunityName: string;
  editorialCommunityAvatar: URL;
  details: string;
};

export type GetReviews = (doi: Doi) => Promise<ReadonlyArray<Review>>;

export default (
  getReviews: GetReviews,
  teaserChars: number,
): RenderFeed => async (doi) => {
  const reviews = await getReviews(doi);
  const renderItem = (review: Review): string => `
      <li class="article-feed__item">
        ${renderAvatar(review.editorialCommunityAvatar)}
        <div class="article-feed__item_body">
          ${templateDate(review.publicationDate, 'article-feed__item__date')}
          <div class="article-feed__item__title">
            Reviewed by
            <a href="/editorial-communities/${review.editorialCommunityId.value}">
              ${review.editorialCommunityName}
            </a>
          </div>

          <div data-teaser>
            ${clip(review.details, teaserChars)}
          </div>
          <button class="article-feed__item-toggle">See more <span aria-hidden="true">+</span></button>
          <div style="display: none;" data-full-text>
            ${review.details}
            <a href="${review.sourceUrl.toString()}" class="article-feed__item__read_more article-call-to-action-link">
              Read the original source
            </a>
          </div>

        </div>
      </li>
    `;

  if (reviews.length === 0) {
    return Result.err('no-content');
  }

  const items = reviews.map(renderItem).join('\n');

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
