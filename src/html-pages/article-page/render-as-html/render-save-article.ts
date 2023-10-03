import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { ListId } from '../../../types/list-id';
import { renderSaveToListForm } from '../../../write-side/save-article/render-save-to-list-form';
import { SaveToAListForms, ViewModel } from '../view-model';

const renderLinkToUserListArticleIsInto = (listId: ListId, listName: string) => `
  <section>
    <h2 class="article-actions-heading">Saved to</h2>
    <a class="saved-to-list" href="/lists/${listId}">
      <img src="/static/images/playlist_add_check-24px.svg" alt="" class="saved-to-list__icon">
      ${listName}
    </a>
  </section>
`;

const renderLoggedOutCallToAction = () => '<a href="/log-in" class="logged-out-call-to-action">Log in to save this article</a>';

const renderSaveToListSection = (forms: string) => `
  <section>
    <h2 class="article-actions-heading">Save to a list</h2>
    ${forms}
    ${process.env.EXPERIMENT_ENABLED === 'true' ? '<a href="/save-article">Save this article</a>' : ''}
  </section>
`;

const renderSaveToList = (viewmodel: ViewModel) => (notInAnyList: SaveToAListForms) => pipe(
  notInAnyList.lists,
  RA.map((list) => renderSaveToListForm(viewmodel.doi, list.listId, list.listName)),
  (forms) => renderSaveToListSection(forms.join('')),
);

export const renderSaveArticle = (viewmodel: ViewModel): HtmlFragment => pipe(
  viewmodel.userListManagement,
  O.match(
    renderLoggedOutCallToAction,
    E.match(
      renderSaveToList(viewmodel),
      (savedToThisList) => renderLinkToUserListArticleIsInto(savedToThisList.listId, savedToThisList.listName),
    ),
  ),
  toHtmlFragment,
);
