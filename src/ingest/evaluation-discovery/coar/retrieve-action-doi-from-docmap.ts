import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Dependencies } from '../../discover-published-evaluations';

export const retrieveActionDoiFromDocmap = (
  dependencies: Dependencies,
) => (
  docmapUri: string,
): TE.TaskEither<string, unknown> => pipe(
  docmapUri,
  dependencies.fetchData<JSON>,
);
