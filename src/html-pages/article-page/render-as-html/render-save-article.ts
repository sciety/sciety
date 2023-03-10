import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { Doi } from '../../../types/doi';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { ListId } from '../../../types/list-id';
import { renderSaveMultipleListsForm } from '../../../write-side/save-article/render-save-multiple-lists-form';
import { UserId } from '../../../types/user-id';

type LoggedInUserListManagement = {
  id: UserId,
  listName: string,
};

export type ViewModel = {
  doi: Doi,
  isArticleInList: O.Option<ListId>,
  userListManagement: O.Option<LoggedInUserListManagement>,
};

const renderSaveArticleCapability = (doi: Doi, listName: string) => () => renderSaveMultipleListsForm(doi, listName);

const renderLinkToOnlyList = (listId: ListId, listName: string) => `
  <div>
    Saved to:
    <a class="saved-to-list" href="/lists/${listId}">
      <img src="/static/images/playlist_add_check-24px.svg" alt="" class="saved-to-list__icon">
      ${listName}
    </a>
  </div>
`;

const renderLoggedOutCallToAction = () => '<a href="/log-in" class="logged-out-call-to-action">Log in to save this article</a>';

export const renderSaveArticle = (viewmodel: ViewModel): HtmlFragment => pipe(
  viewmodel.userListManagement,
  O.match(
    renderLoggedOutCallToAction,
    (userListManagement) => pipe(
      viewmodel.isArticleInList,
      O.fold(
        renderSaveArticleCapability(viewmodel.doi, userListManagement.listName),
        (listId) => renderLinkToOnlyList(listId, userListManagement.listName),
      ),
    ),
  ),
  toHtmlFragment,
);
