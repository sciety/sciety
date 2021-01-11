import * as TE from 'fp-ts/lib/TaskEither';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

export const renderSavedArticles = (userId: UserId): TE.TaskEither<never, HtmlFragment> => {
  let savedArticlesList = toHtmlFragment('');

  if (userId === '1295307136415735808') {
    savedArticlesList = toHtmlFragment(`
      <section>
        <h2>Saved articles</h2>
        <ol class="saved-articles">
          <li class="saved-articles__item">
            <a href="/articles/10.1101/2020.07.04.187583" class="saved-articles__link">Gender, race and parenthood impact academic productivity during the COVID-19 pandemic: from survey to action</a>
          </li>
          <li class="saved-articles__item">
            <a href="/articles/10.1101/2020.09.09.289785" class="saved-articles__link">The Costs and Benefits of a Modified Biomedical Science Workforce</a>
          </li>
        </ol>
      </section>
    `);
  }

  return TE.right(savedArticlesList);
};
