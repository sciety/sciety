import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { PageOfItems } from '../../../shared-components/paginate';
import { Doi } from '../../../types/doi';
import { Queries } from '../../../shared-read-models';

type PopulateArticleActivities = (queries: Queries)
=> (pageOfItems: PageOfItems<Doi>)
=> PageOfItems<ReturnType<Queries['getActivityForDoi']>>;

export const populateArticleActivities: PopulateArticleActivities = (queries) => (pageOfItems) => ({
  ...pageOfItems,
  items: pipe(
    pageOfItems.items,
    RA.map(queries.getActivityForDoi),
  ),
});
