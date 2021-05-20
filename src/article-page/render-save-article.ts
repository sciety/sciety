import * as O from 'fp-ts/Option';
import { constant, pipe } from 'fp-ts/function';
import { renderSaveForm } from './render-save-form';
import { renderSavedLink } from './render-saved-link';
import { Doi } from '../types/doi';
import { HtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

// TODO overload so if `userId` is `O.None` `hasUserSavedArticle` must be `false`
type OldRenderSaveArticle = (doi: Doi, userId: O.Option<UserId>, hasUserSavedArticle: boolean) => HtmlFragment;

export const oldRenderSaveArticle: OldRenderSaveArticle = (doi, userId, hasUserSavedArticle) => pipe(
  userId,
  O.filter(constant(hasUserSavedArticle)),
  O.fold(
    () => renderSaveForm(doi),
    (u) => renderSavedLink(u),
  ),
);

type ArticleSaveState = {
  userId: UserId,
  hasSavedArticle: boolean,
};

type RenderSaveArticle = (doi: Doi) => (userSaveState: O.Option<ArticleSaveState>) => HtmlFragment;

export const renderSaveArticle: RenderSaveArticle = (doi) => (userSaveState) => pipe(
  userSaveState,
  O.filter((uss) => uss.hasSavedArticle),
  O.fold(
    () => renderSaveForm(doi),
    ({ userId }) => renderSavedLink(userId),
  ),
);
