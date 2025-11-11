import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import LinkHeader from 'http-link-header';
import * as t from 'io-ts';
import { Dependencies } from '../../discover-published-evaluations';
import { decodeAndReportFailures } from '../decode-and-report-failures';

const headCodec = t.strict({
  link: t.string,
});

const docmapUriCodec = t.strict({
  uri: t.string,
  rel: t.literal('describedby'),
  profile: t.literal('https://w3id.org/docmaps/context.jsonld'),
});

type Head = t.TypeOf<typeof headCodec>;

const extractSignpostingDocmapUris = (head: Head) => pipe(
  E.tryCatch(
    () => pipe(
      LinkHeader.parse(head.link),
      (linkHeader) => linkHeader.refs,
      RA.filter(docmapUriCodec.is),
    ),
    () => 'failed to parse',
  ),
);

export const transformAnnouncementActionUriToSignpostingDocmapUri = (
  dependencies: Dependencies,
) => (
  announcementActionUri: string,
): TE.TaskEither<string, string> => pipe(
  announcementActionUri,
  dependencies.fetchHead,
  TE.chainEitherK(decodeAndReportFailures(headCodec)),
  TE.chainEitherK(extractSignpostingDocmapUris),
  TE.map(RA.head),
  TE.flatMapEither(E.fromOption(() => 'No DocMap URI found.')),
  TE.map((link) => link.uri),
);
