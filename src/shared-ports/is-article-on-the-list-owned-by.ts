import { Doi } from '../types/doi';
import { UserId } from '../types/user-id';

export type IsArticleOnTheListOwnedBy = (userId: UserId) => (articleId: Doi) => boolean;
