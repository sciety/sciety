import { GetUnlistedArticles, getUnlistedArticles } from './get-unlisted-articles';
import { ReadModel } from './handle-event';

export type Queries = {
  getUnlistedArticles: GetUnlistedArticles,
};

export const queries = (instance: ReadModel): Queries => ({
  getUnlistedArticles: getUnlistedArticles(instance),
});
