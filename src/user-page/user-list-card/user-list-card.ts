import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { renderListCard } from '../../shared-components/list-card/render-list-card';
import { List } from '../../shared-ports/select-all-lists-owned-by';
import { HtmlFragment } from '../../types/html-fragment';
import { defaultUserListDescription } from '../static-messages';

export const userListCard = (handle: string, list: List): HtmlFragment => pipe(
  {
    listId: list.listId,
    articleCount: list.articleIds.length,
    lastUpdated: O.some(list.lastUpdated),
    href: `/users/${handle}/lists/saved-articles`,
    title: 'Saved articles',
    description: defaultUserListDescription(`@${handle}`),
    articleCountLabel: 'This list contains',
  },
  renderListCard,

);
