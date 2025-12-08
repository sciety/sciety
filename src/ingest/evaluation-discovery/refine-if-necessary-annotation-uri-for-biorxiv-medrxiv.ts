import { URL } from 'url';
import * as TE from 'fp-ts/TaskEither';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { Annotation } from './hypothesis/annotation';
import { uriIsMissingBiorxivMedrxivDoiPrefix } from './uri-is-missing-biorxiv-medrxiv-doi-prefix';
import { deriveUriContainingBiorxivMedrxivDoiPrefix } from '../derive-uri-containing-biorxiv-medrxiv-doi-prefix';
import { Dependencies } from '../discover-published-evaluations';

const isUriFromBiorxivMedrxiv = (uri: string): boolean => {
  try {
    const url = new URL(uri);
    const hostname = url.hostname;
    return hostname === 'biorxiv.org' || hostname === 'medrxiv.org';
  } catch (e) {
    return false;
  }
};

export const refineIfNecessaryAnnotationUriForBiorxivMedrxiv = (
  dependencies: Dependencies,
) => (
  annotation: Annotation,
): TE.TaskEither<string, Annotation> => pipe(
  annotation.uri,
  (uri) => isUriFromBiorxivMedrxiv(uri) && uriIsMissingBiorxivMedrxivDoiPrefix(uri),
  B.match(
    () => TE.right(annotation),
    () => pipe(
      annotation.uri,
      deriveUriContainingBiorxivMedrxivDoiPrefix(dependencies),
      TE.map((uri) => ({ ...annotation, uri })),
    ),
  ),
);
