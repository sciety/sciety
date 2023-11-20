import * as O from 'fp-ts/Option';
import { List } from '../../types/list';
import { ListCardViewModel } from './render-list-card';
import { rawUserInput } from '../../read-models/annotations/handle-event';

export const constructListCardViewModelWithoutAvatar = (list: List): ListCardViewModel => ({
  listId: list.id,
  articleCount: list.articleIds.length,
  updatedAt: O.some(list.updatedAt),
  title: list.name,
  description: rawUserInput(list.description),
  avatarUrl: O.none,
});
