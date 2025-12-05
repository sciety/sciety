import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { DependenciesForFetchHead } from './discover-published-evaluations';
import { Annotation } from './evaluation-discovery/hypothesis/annotation';

export const deriveUriContainingBiorxivMedrxivDoiPrefix = (
  dependencies: DependenciesForFetchHead,
) => (
  annotation: Annotation,
): TE.TaskEither<string, Annotation> => pipe(
  annotation.uri,
  dependencies.fetchHead,
  () => TE.left('not implemented'),
);
