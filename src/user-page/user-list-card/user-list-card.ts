import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { getUserListDetails } from './get-user-list-details';
import { renderUserListCard } from './render-user-list-card';
import { HtmlFragment } from '../../types/html-fragment';

export const userListCard = (handle: string): T.Task<HtmlFragment> => pipe(
  {
    ...getUserListDetails(),
    handle,
  },
  renderUserListCard,
  T.of,
);
