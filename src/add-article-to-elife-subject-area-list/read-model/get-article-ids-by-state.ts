import { ReadModel } from './handle-event';
import { ArticleIdsByState } from '../read-model-status';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getArticleIdsByState = (readModel: ReadModel) => (): ArticleIdsByState => ({
  evaluated: [],
  listed: [],
  'category-known': [],
  'evaluated-and-category-known': [],
});
