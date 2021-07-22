import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { renderUserListCard } from './render-user-list-card';
import { HtmlFragment } from '../../types/html-fragment';

export const userListCard = (handle: string): T.Task<HtmlFragment> => pipe(
  {
    articleCount: 0,
    handle,
  },
  renderUserListCard,
  T.of,
);
