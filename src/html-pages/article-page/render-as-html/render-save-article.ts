import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { renderSaveForm } from '../../../write-side/save-article/render-save-form';
import { Doi } from '../../../types/doi';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { ListId } from '../../../types/list-id';
import { renderSaveMultipleListsForm } from '../../../write-side/save-article/render-save-multiple-lists-form';
import { UserId } from '../../../types/user-id';

type ViewModel = {
  doi: Doi,
  isArticleInList: O.Option<ListId>,
  userId: O.Option<UserId>,
};

const renderSaveArticleCapability = (doi: Doi) => () => (process.env.EXPERIMENT_ENABLED === 'true' ? renderSaveMultipleListsForm(doi) : renderSaveForm(doi));

const renderLinkToOnlyList = (listId: ListId) => `
      <a class="saved-to-list" href="/lists/${listId}">
        <img src="/static/images/playlist_add_check-24px.svg" alt="" class="saved-to-list__icon">
        Saved to my list
      </a>
    `;

export const renderSaveArticle = (viewmodel: ViewModel): HtmlFragment => pipe(
  viewmodel.isArticleInList,
  O.fold(
    renderSaveArticleCapability(viewmodel.doi),
    renderLinkToOnlyList,
  ),
  toHtmlFragment,
);
