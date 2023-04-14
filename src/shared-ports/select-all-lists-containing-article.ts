import { Doi } from '../types/doi';
import { List } from '../types/list';

export type SelectAllListsContainingArticle = (articleId: Doi) => ReadonlyArray<List>;
