import * as E from 'fp-ts/Either';
import { DependenciesForFetchHead } from './discover-published-evaluations';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const deriveUriContainingBiorxivMedrxivDoiPrefix = (dependencies?: DependenciesForFetchHead) => (uri: string): E.Either<string, string> => E.left('Unable to derive a URI containing the full DOI.');
