import * as O from 'fp-ts/Option';
import { constant, pipe } from 'fp-ts/function';
import { renderSaveForm } from '../save-article/render-save-form';
import { renderSavedLink } from './render-saved-link';
import { Doi } from '../types/doi';
import { HtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

// TODO overload so if `userId` is `O.None` `hasUserSavedArticle` must be `false`
type RenderSaveArticle = (doi: Doi, userId: O.Option<UserId>, hasUserSavedArticle: boolean) => HtmlFragment;

export const renderSaveArticle: RenderSaveArticle = (doi, userId, hasUserSavedArticle) => pipe(
  userId,
  O.filter(constant(hasUserSavedArticle)),
  O.fold(
    () => renderSaveForm(doi),
    (u) => renderSavedLink(u),
  ),
);
