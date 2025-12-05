import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { DependenciesForFetchHead } from './discover-published-evaluations';
import { decodeAndReportFailures } from './evaluation-discovery/decode-and-report-failures';

const headCodec = t.strict({
  link: t.string,
});

export const deriveUriContainingBiorxivMedrxivDoiPrefix = (
  dependencies: DependenciesForFetchHead,
) => (
  uri: string,
): TE.TaskEither<string, string> => pipe(
  uri,
  dependencies.fetchHead,
  TE.chainEitherK(decodeAndReportFailures(headCodec)),
  TE.map((response) => response.link),
);
