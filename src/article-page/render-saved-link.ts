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

export const renderSavedLink: RenderSavedLink = (doi, userId) => {
  const savedDois = ['10.1101/2020.07.04.187583', '10.1101/2020.09.09.289785'];

  return pipe(
    userId,
    O.filter((u) => u === '1295307136415735808'),
    O.filter(() => savedDois.includes(doi.value)),
    O.map(templateSavedLink),
    O.fold(
      constant(''),
      identity,
    ),
  );
};
