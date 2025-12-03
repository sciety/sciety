import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { DependenciesForFetchHead } from './discover-published-evaluations';

export const deriveUriContainingBiorxivMedrxivDoiPrefix = (
  dependencies: DependenciesForFetchHead,
) => (
  uri: string,
): E.Either<string, string> => pipe(
  uri,
  dependencies.fetchHead,
  () => E.left('Unable to derive a URI containing the full DOI.'),
);
