import * as O from 'fp-ts/Option';
import { Doi } from '../types/doi';
import { List } from '../types/list';
import { UserId } from '../types/user-id';

export type IsArticleOnTheListOwnedBy = (userId: UserId) => (articleId: Doi) => O.Option<List>;
