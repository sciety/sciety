import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { renderSaveForm } from './render-save-form';
import { renderSavedLink } from './render-saved-link';
import { Doi } from '../types/doi';
import { HtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

type HasUserSavedArticle = (doi: Doi, userId: UserId) => T.Task<boolean>;

type RenderSaveArticle = (doi: Doi, userId: O.Option<UserId>) => T.Task<HtmlFragment>;

export const renderSaveArticle = (
  hasUserSavedArticle: HasUserSavedArticle,
): RenderSaveArticle => (doi, userId) => pipe(
  userId,
  O.fold(
    () => T.of(renderSaveForm(doi)),
    (u) => pipe(
      hasUserSavedArticle(doi, u),
      T.map(B.fold(
        () => renderSaveForm(doi),
        () => renderSavedLink(u),
      )),
    ),
  ),
);
