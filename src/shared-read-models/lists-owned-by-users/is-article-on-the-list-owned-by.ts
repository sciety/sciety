import { ReadModel } from './handle-event';
import { Doi } from '../../types/doi';
import { UserId } from '../../types/user-id';

type IsArticleOnTheListOwnedBy = (userId: UserId) => (articleId: Doi) => boolean;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isArticleOnTheListOwnedBy = (readmodel: ReadModel): IsArticleOnTheListOwnedBy => () => () => true;
