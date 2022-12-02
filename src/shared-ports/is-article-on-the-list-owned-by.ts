import * as O from 'fp-ts/Option';
import { Doi } from '../types/doi';
import { ListId } from '../types/list-id';
import { UserId } from '../types/user-id';

export type IsArticleOnTheListOwnedBy = (userId: UserId) => (articleId: Doi) => () => O.Option<ListId>;
