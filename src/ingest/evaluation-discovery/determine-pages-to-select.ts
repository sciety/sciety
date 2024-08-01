import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Dependencies } from '../discover-published-evaluations';

export type SelectedPage = { rows: number, offset: number };

export const determinePagesToSelect = (
  dependencies: Dependencies,
): TE.TaskEither<string, ReadonlyArray<SelectedPage>> => pipe(
  'https://api.crossref.org/works?filter=prefix:10.1099,type:peer-review,relation.type:is-review-of',
  dependencies.fetchData,
  TE.map(() => [
    { rows: 1000, offset: 0 },
    { rows: 1000, offset: 1000 },
  ]),
);
