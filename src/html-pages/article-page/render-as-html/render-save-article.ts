import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { ListId } from '../../../types/list-id';
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

const renderSaveToList = (notInAnyList: SaveToAListForms) => `
<section>
  <a href="${notInAnyList.saveArticleHref}" class="article-actions__save_article">Save this article</a>
</section>
`;

export const renderSaveArticle = (viewmodel: ViewModel): HtmlFragment => pipe(
  viewmodel.userListManagement,
  O.match(
    renderLoggedOutCallToAction,
    E.match(
      renderSaveToList,
      (savedToThisList) => renderLinkToUserListArticleIsInto(savedToThisList.listId, savedToThisList.listName),
    ),
  ),
  toHtmlFragment,
);
