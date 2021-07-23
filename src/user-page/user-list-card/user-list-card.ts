import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { getUserListDetails } from './get-user-list-details';
import { renderUserListCard } from './render-user-list-card';
import { HtmlFragment } from '../../types/html-fragment';
import { toUserId } from '../../types/user-id';

export const userListCard = (handle: string): T.Task<HtmlFragment> => pipe(
  {
    ...getUserListDetails(toUserId('0'))([]),
    handle,
  },
  renderUserListCard,
  T.of,
);
