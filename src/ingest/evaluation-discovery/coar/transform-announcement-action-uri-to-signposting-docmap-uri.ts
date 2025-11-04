import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
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

export const transformAnnouncementActionUriToSignpostingDocmapUri = (
  dependencies: Dependencies,
) => (
  announcementActionUri: string,
): TE.TaskEither<string, string> => pipe(
  announcementActionUri,
  dependencies.fetchHead,
  TE.chainEitherK(decodeAndReportFailures(headCodec)),
  TE.map((head) => head.link.split(/,\s*/)),
  TE.map(RA.filter((link) => link.match(/<http[^>]+>/) !== null)),
  TE.map(RA.filter((link) => link.match(/(^|\s)rel="describedby"/) !== null)),
  TE.map(RA.filter((link) => link.match(/(^|\s)profile="https:\/\/w3id\.org\/docmaps\/context\.jsonld"/) !== null)),
  TE.map(() => ''),
);
