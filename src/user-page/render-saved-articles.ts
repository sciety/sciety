import * as O from 'fp-ts/lib/Option';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import templateListItems from '../shared-components/list-items';
import Doi from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

type SavedArticle = {
  doi: Doi,
  title: HtmlFragment,
};

export type GetSavedArticles = (userId: UserId) => ReadonlyArray<SavedArticle>;

const renderAsLink = (item: SavedArticle): HtmlFragment => toHtmlFragment(`
  <a href="/articles/${item.doi.value}" class="saved-articles__link">${item.title}</a>
`);

export const renderSavedArticles = (
  savedArticles: GetSavedArticles,
) => (userId: UserId): TE.TaskEither<never, HtmlFragment> => pipe(
  savedArticles(userId).map(renderAsLink),
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
  TE.right,
);
