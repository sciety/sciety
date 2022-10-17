import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { renderSaveForm } from '../../save-article/render-save-form';
import { Doi } from '../../types/doi';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { UserId } from '../../types/user-id';

type ViewModel = {
  userId: O.Option<UserId>,
  hasUserSavedArticle: boolean,
  doi: Doi,
  userListUrl: O.Option<string>,
};

export const renderSaveArticle = (viewmodel: ViewModel): HtmlFragment => pipe(
  viewmodel.userListUrl,
  O.fold(
    () => renderSaveForm(viewmodel.doi),
    (url) => `
      <a class="saved-to-list" href="${url}">
        <img src="/static/images/playlist_add_check-24px.svg" alt="" class="saved-to-list__icon">
        Saved to my list
      </a>
    `,
  ),
  toHtmlFragment,
);
