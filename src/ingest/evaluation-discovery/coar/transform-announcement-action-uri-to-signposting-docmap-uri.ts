import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import LinkHeader from 'http-link-header';
import * as t from 'io-ts';
import { Dependencies } from '../../discover-published-evaluations';
import { decodeAndReportFailures } from '../decode-and-report-failures';

// <https://neuro.peercommunityin.org/metadata/docmaps?article_id=217>; rel="describedby" type="application/ld+json" profile="https://w3id.org/docmaps/context.jsonld", <https://neuro.peercommunityin.org/metadata/crossref?article_id=217>; rel="describedby" type="application/xml" profile="http://www.crossref.org/schema/4.3.7"

// <https://neuro.peercommunityin.org/metadata/docmaps?article_id=217>; rel="describedby" type="application/ld+json" profile="https://w3id.org/docmaps/context.jsonld"
// <https://neuro.peercommunityin.org/metadata/crossref?article_id=217>; rel="describedby" type="application/xml" profile="http://www.crossref.org/schema/4.3.7"

// <https://neuro.peercommunityin.org/metadata/docmaps?article_id=217>; rel="describedby" type="application/ld+json" profile="https://w3id.org/docmaps/context.jsonld"

// https://neuro.peercommunityin.org/metadata/docmaps?article_id=217

const headCodec = t.strict({
  link: t.string,
});

const docmapUriCodec = t.strict({
  uri: t.string,
  rel: t.literal('describedby'),
  profile: t.literal('https://w3id.org/docmaps/context.jsonld'),
});

type DocmapUri = t.TypeOf<typeof docmapUriCodec>;

type Head = t.TypeOf<typeof headCodec>;

const isDocmapUri = (value: unknown): value is DocmapUri => typeof value !== 'string';

const extractSignpostingDocmapUris = (head: Head) => pipe(
  E.tryCatch(
    () => pipe(
      LinkHeader.parse(head.link),
      (linkHeader) => linkHeader.refs,
      RA.map(decodeAndReportFailures(docmapUriCodec)),
      RA.map(E.getOrElseW(() => 'failed to decode')),
      RA.filter(isDocmapUri),
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
  TE.flatMap((links) => (links.length > 0 ? TE.right(links[0].uri) : TE.left(''))),
);
