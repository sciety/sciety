import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { DependenciesForFetchHead } from './discover-published-evaluations';

export const deriveUriContainingBiorxivMedrxivDoiPrefix = (
  dependencies: DependenciesForFetchHead,
) => (
  uri: string,
): TE.TaskEither<string, string> => pipe(
  uri,
  dependencies.fetchHead,
  () => TE.right('not implemented'),
);
