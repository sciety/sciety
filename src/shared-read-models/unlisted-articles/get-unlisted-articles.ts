import { ReadModel } from './handle-event';
import { Doi } from '../../types/doi';
import { ListId } from '../../types/list-id';

type UnlistedArticle = {
  articleId: Doi,
  listId: ListId,
};

export type GetUnlistedArticles = () => ReadonlyArray<UnlistedArticle>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getUnlistedArticles = (readModel: ReadModel): GetUnlistedArticles => () => [];
