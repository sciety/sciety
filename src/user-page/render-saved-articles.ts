import * as TE from 'fp-ts/lib/TaskEither';
import templateListItems from '../shared-components/list-items';
import Doi from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

type SavedArticle = {
  doi: Doi,
  title: HtmlFragment,
};

const savedArticles = (userId: UserId): ReadonlyArray<SavedArticle> => {
  if (userId === '1295307136415735808') {
    return [
      {
        doi: new Doi('10.1101/2020.07.04.187583'),
        title: toHtmlFragment('Gender, race and parenthood impact academic productivity during the COVID-19 pandemic: from survey to action'),
      },
      {
        doi: new Doi('10.1101/2020.09.09.289785'),
        title: toHtmlFragment('The Costs and Benefits of a Modified Biomedical Science Workforce'),
      },
    ];
  }
  return [];
};

export const renderSavedArticles = (userId: UserId): TE.TaskEither<never, HtmlFragment> => {
  let savedArticlesList = toHtmlFragment('');

  const items = savedArticles(userId).map((item) => toHtmlFragment(`
    <a href="/articles/${item.doi.value}" class="saved-articles__link">${item.title}</a>
  `));
  if (items.length > 0) {
    const list = templateListItems(items, 'saved-articles__item');
    savedArticlesList = toHtmlFragment(`
      <section>
        <h2>Saved articles</h2>
        <ol class="saved-articles">
          ${list}
        </ol>
      </section>
    `);
  }

  return TE.right(savedArticlesList);
};
