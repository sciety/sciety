import * as O from 'fp-ts/Option';
import { constant, identity, pipe } from 'fp-ts/function';
import Doi from '../types/doi';
import { UserId } from '../types/user-id';

type RenderSavedLink = (doi: Doi, userId: O.Option<UserId>) => string;

const templateSavedLink = (userId: UserId): string => `
  <a class="saved-to-list" href="/users/${userId}">
    <img src="/static/images/playlist_add_check-24px.svg" alt="" class="saved-to-list__icon">
    Saved to list
  </a>
`;

export type HasUserSavedArticle = (doi: Doi, userId: UserId) => boolean;

export const renderSavedLink = (hasUserSavedArticle: HasUserSavedArticle): RenderSavedLink => (doi, userId) => pipe(
  userId,
  O.filter((u) => hasUserSavedArticle(doi, u)),
  O.map(templateSavedLink),
  O.fold(
    constant(''),
    identity,
  ),
);
