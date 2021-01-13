import { flow } from 'fp-ts/function';
import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import templateListItems from '../shared-components/list-items';
import Doi from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

export type SavedArticle = {
  doi: Doi,
  title: O.Option<HtmlFragment>,
};

export type GetSavedArticles = (userId: UserId) => T.Task<ReadonlyArray<SavedArticle>>;

type RenderAsLink = (savedArticle: SavedArticle) => HtmlFragment;

const renderAsLink: RenderAsLink = flow(
  (item) => ({
    doi: item.doi,
    title: O.getOrElse(
      () => toHtmlFragment('an article'),
    )(item.title),
  }),
  (item) => `<a href="/articles/${item.doi.value}" class="saved-articles__link">${item.title}</a>`,
  toHtmlFragment,
);

export const renderSavedArticles = flow(
  (savedArticlesArray: ReadonlyArray<SavedArticle>) => savedArticlesArray.map(renderAsLink),
  O.fromPredicate((items) => items.length > 0),
  O.map((items) => templateListItems(items, 'saved-articles__item')),
  O.fold(
    () => '',
    (list) => `
        <section>
          <h2>Saved articles</h2>
          <ol class="saved-articles">
            ${list}
          </ol>
        </section>
      `,
  ),
  toHtmlFragment,
);
