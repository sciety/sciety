import * as O from 'fp-ts/Option';
import { List } from '../../read-models/lists/index.js';
import { ListCardViewModel } from './render-list-card.js';
import { rawUserInput } from '../../read-models/annotations/handle-event.js';

export const constructListCardViewModelWithoutAvatar = (list: List): ListCardViewModel => ({
  listId: list.id,
  articleCount: list.entries.length,
  updatedAt: O.some(list.updatedAt),
  title: list.name,
  description: rawUserInput(list.description),
  avatarUrl: O.none,
});
