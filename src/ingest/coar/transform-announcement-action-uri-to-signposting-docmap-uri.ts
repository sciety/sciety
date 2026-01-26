import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import LinkHeader from 'http-link-header';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { DependenciesForFetchHead } from '../discover-published-evaluations';
import { decodeAndReportFailures } from '../legacy/evaluation-discovery/decode-and-report-failures';

const headCodec = t.strict({
  link: t.string,
});

const docmapUriCodec = t.strict({
  uri: tt.NonEmptyString,
  rel: t.literal('describedby'),
  profile: t.literal('https://w3id.org/docmaps/context.jsonld'),
});

type Head = t.TypeOf<typeof headCodec>;

const extractSignpostingDocmapUri = (head: Head) => pipe(
  E.tryCatch(
    () => LinkHeader.parse(head.link),
    () => 'Failed to parse.',
  ),
  E.map((linkHeader) => linkHeader.refs),
  E.map(RA.findFirst(docmapUriCodec.is)),
  E.chain(E.fromOption(() => 'No DocMap URI found.')),
);

export const transformAnnouncementActionUriToSignpostingDocmapUri = (
  dependencies: DependenciesForFetchHead,
) => (
  announcementActionUri: string,
): TE.TaskEither<string, string> => pipe(
  announcementActionUri,
  dependencies.fetchHead,
  TE.chainEitherK(decodeAndReportFailures(headCodec)),
  TE.chainEitherK(extractSignpostingDocmapUri),
  TE.map((link) => link.uri),
);
