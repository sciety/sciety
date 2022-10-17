import * as O from 'fp-ts/Option';
import { constant, pipe } from 'fp-ts/function';
import { renderSavedLink } from './render-saved-link';
import { renderSaveForm } from '../../save-article/render-save-form';
import { Doi } from '../../types/doi';
import { HtmlFragment } from '../../types/html-fragment';
import { UserId } from '../../types/user-id';

type ViewModel = {
  userId: O.Option<UserId>,
  hasUserSavedArticle: boolean,
  doi: Doi,
};

export const renderSaveArticle = (viewmodel: ViewModel): HtmlFragment => pipe(
  viewmodel.userId,
  O.filter(constant(viewmodel.hasUserSavedArticle)),
  O.fold(
    () => renderSaveForm(viewmodel.doi),
    (u) => renderSavedLink(u),
  ),
);
