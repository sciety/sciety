import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { flow } from 'fp-ts/function';
import { templateListItems } from '../../shared-components/list-items';
import { Doi } from '../../types/doi';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

type SavedArticle = {
  doi: Doi,
  title: HtmlFragment,
};

const renderAsLink = flow(
  (item: SavedArticle) => `<a href="/articles/activity/${item.doi.value}" class="saved-articles__link">${item.title}</a>`,
  toHtmlFragment,
);

export const renderSavedArticles = flow(
  RA.map(renderAsLink),
  RNEA.fromReadonlyArray,
  O.map((items) => templateListItems(items, 'saved-articles__item')),
  O.fold(
    () => '',
    (list) => `
        <section id="saved-articles">
          <h2>Saved articles</h2>
          <ol class="saved-articles" role="list">
            ${list}
          </ol>
        </section>
      `,
  ),
  toHtmlFragment,
);
