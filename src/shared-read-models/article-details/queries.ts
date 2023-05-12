import { ReadModel } from './handle-event';
import { LookupArticleDetails, lookupArticleDetails } from './lookup-article-details';

export type Queries = {
  lookupArticleDetails: LookupArticleDetails,
};

export const queries = (instance: ReadModel): Queries => ({
  lookupArticleDetails: lookupArticleDetails(instance),
});
