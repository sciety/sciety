import * as O from 'fp-ts/Option';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { Doi } from '../../../types/doi';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { ListId } from '../../../types/list-id';
import { renderSaveMultipleListsForm } from '../../../write-side/save-article/render-save-multiple-lists-form';

type LoggedInUserListManagement = {
  listName: string,
  listId: ListId,
  isArticleInList: boolean,
};

export type ViewModel = {
  doi: Doi,
  userListManagement: O.Option<LoggedInUserListManagement>,
};

const renderLinkToUserListArticleIsInto = (listId: ListId, listName: string) => `
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
      userListManagement.isArticleInList,
      B.match(
        () => renderSaveMultipleListsForm(viewmodel.doi, userListManagement.listName),
        () => renderLinkToUserListArticleIsInto(userListManagement.listId, userListManagement.listName),
      ),
    ),
  ),
  toHtmlFragment,
);
