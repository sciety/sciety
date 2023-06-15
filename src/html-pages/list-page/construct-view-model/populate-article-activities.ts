import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Doi } from '../../../types/doi';
import { Queries } from '../../../shared-read-models';

type PopulateArticleActivities = (queries: Queries)
=> (input: { items: ReadonlyArray<Doi> })
=> { items: ReadonlyArray<ReturnType<Queries['getActivityForDoi']>> };

export const populateArticleActivities: PopulateArticleActivities = (queries) => (input) => ({
  items: pipe(
    input.items,
    RA.map(queries.getActivityForDoi),
  ),
});
