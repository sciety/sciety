import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { renderSaveForm } from '../../../write-side/save-article/render-save-form';
import { Doi } from '../../../types/doi';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { ListId } from '../../../types/list-id';

type ViewModel = {
  doi: Doi,
  isArticleInList: O.Option<ListId>,
};

export const renderSaveArticle = (viewmodel: ViewModel): HtmlFragment => pipe(
  viewmodel.isArticleInList,
  O.fold(
    () => (process.env.EXPERIMENT_ENABLED === 'true' ? renderSaveForm(viewmodel.doi) : renderSaveForm(viewmodel.doi)),
    (listId) => `
      <a class="saved-to-list" href="/lists/${listId}">
        <img src="/static/images/playlist_add_check-24px.svg" alt="" class="saved-to-list__icon">
        Saved to my list
      </a>
    `,
  ),
  toHtmlFragment,
);
