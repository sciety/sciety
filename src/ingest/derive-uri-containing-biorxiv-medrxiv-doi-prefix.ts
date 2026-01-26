import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { DependenciesForFetchHead } from './discover-published-evaluations';
import { decodeAndReportFailures } from './legacy/evaluation-discovery/decode-and-report-failures';

const headCodec = t.strict({
  link: t.string,
});

const linkContainsBiorxivMedrxivPrefix = (link: string): E.Either<string, string> => pipe(
  link,
  E.fromPredicate(
    (l) => (l.includes('10.64898') || l.includes('10.1101')),
    () => 'Link does not contain biorxiv nor medrxiv prefix.',
  ),
);

export const deriveUriContainingBiorxivMedrxivDoiPrefix = (
  dependencies: DependenciesForFetchHead,
) => (
  uri: string,
): TE.TaskEither<string, string> => pipe(
  uri,
  dependencies.fetchHead,
  TE.flatMapEither(decodeAndReportFailures(headCodec)),
  TE.map((response) => response.link),
  TE.flatMapEither(linkContainsBiorxivMedrxivPrefix),
);
