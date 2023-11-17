import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { htmlEscape } from 'escape-goat';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment.js';
import { SaveArticleCta, ViewModel } from '../view-model.js';

const renderLinkToUserListArticleIsInto = (listName: string, listHref: string) => `
  <section>
    <h2 class="article-actions-heading">Saved to</h2>
    <a class="saved-to-list" href="${listHref}">
      <img src="/static/images/playlist_add_check-24px.svg" alt="" class="saved-to-list__icon">
      ${htmlEscape(listName)}
    </a>
  </section>
`;

const renderLoggedOutCallToAction = () => '<a href="/log-in" class="logged-out-call-to-action">Log in to save this article</a>';

const renderSaveToList = (saveArticleCta: SaveArticleCta) => `
<section>
  <a href="${saveArticleCta.saveArticleHref}" class="article-actions__save_article">Save this article</a>
</section>
`;

export const renderUserListManagement = (viewmodel: ViewModel): HtmlFragment => pipe(
  viewmodel.userListManagement,
  O.match(
    renderLoggedOutCallToAction,
    E.match(
      renderSaveToList,
      (savedToThisList) => renderLinkToUserListArticleIsInto(savedToThisList.listName, savedToThisList.listHref),
    ),
  ),
  toHtmlFragment,
);
