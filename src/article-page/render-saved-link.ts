import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as B from 'fp-ts/boolean';
import { constant, pipe } from 'fp-ts/function';
import Doi from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

type RenderSavedLink = (doi: Doi, userId: O.Option<UserId>) => T.Task<HtmlFragment>;

const templateSavedLink = (userId: UserId): string => `
  <a class="saved-to-list" href="/users/${userId}#saved-articles">
    <img src="/static/images/playlist_add_check-24px.svg" alt="" class="saved-to-list__icon">
    Saved to list
  </a>
`;

export type HasUserSavedArticle = (doi: Doi, userId: UserId) => T.Task<boolean>;

export const renderSavedLink = (hasUserSavedArticle: HasUserSavedArticle): RenderSavedLink => (doi, userId) => pipe(
  userId,
  O.fold(
    constant(T.of('')),
    (u) => pipe(
      hasUserSavedArticle(doi, u),
      T.map(B.fold(
        constant(''),
        () => templateSavedLink(u),
      )),
    ),
  ),
  T.map(toHtmlFragment),
);
