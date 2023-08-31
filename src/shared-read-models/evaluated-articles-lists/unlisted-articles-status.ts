import { Json } from 'fp-ts/Json';
import { getUnlistedEvaluatedArticles } from './get-unlisted-evaluated-articles';
import { ReadModel } from './handle-event';

export const unlistedArticlesStatus = (readmodel: ReadModel) => (): Json => ({
  articles: getUnlistedEvaluatedArticles(readmodel)(),
});
