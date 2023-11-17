import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment.js';
import { renderListItems } from '../../../shared-components/render-list-items.js';
import { ViewModel } from '../view-model.js';

const renderCurationTeaser = (viewModel: ViewModel['curationTeasers'][number]) => toHtmlFragment(`
  <article>
    <figure class="curation-teaser">
      <div class="curation-teaser__quote_wrapper">
        <blockquote class="curation-teaser__quote" cite="${viewModel.articleHref}">
          ${viewModel.quote}
        </blockquote>
      </div>
      <figcaption>
        <p class="curation-teaser__strapline">${viewModel.caption}</p>
        <cite><a href="${viewModel.articleHref}">${viewModel.articleTitle}</a></cite>
      </figcaption>
    </figure>
  </article>
`);

export const renderCurationTeasers = (viewmodel: ViewModel): HtmlFragment => pipe(
  viewmodel.curationTeasers,
  RA.map(renderCurationTeaser),
  renderListItems,
  (listItems) => `
    <section class="curation-teasers">
      <h2 class="curation-teasers__title">Recent curated preprints</h2>
      <ul class="curation-teasers__teasers">
        ${listItems}
      </ul>
    </section>
  `,
  toHtmlFragment,
);
