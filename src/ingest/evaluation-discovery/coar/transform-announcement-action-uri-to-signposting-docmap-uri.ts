import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
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

const signpostingDocmapLinkCodec = t.strict({
  uri: t.string,
  rel: t.literal('describedby'),
  profile: t.literal('https://w3id.org/docmaps/context.jsonld'),
});

const signpostingDocmapUriFromLink = (linkHeader: string) => pipe(
  O.tryCatch(() => LinkHeader.parse(linkHeader)),
  O.map(({ refs }) => refs),
  O.getOrElse((): ReadonlyArray<LinkHeader.Reference> => RA.empty),
  RA.map(signpostingDocmapLinkCodec.decode),
  RA.filterMap(O.getRight),
  RA.head,
  O.map((ref) => ref.uri),
);

const docmapUri = (
  headerLink: string,
) => pipe(
  headerLink,
  signpostingDocmapUriFromLink,
  E.fromOption(() => 'No DocMap uri found'),
);

export const transformAnnouncementActionUriToSignpostingDocmapUri = (
  dependencies: Dependencies,
) => (
  announcementActionUri: string,
): TE.TaskEither<string, string> => pipe(
  announcementActionUri,
  dependencies.fetchHead,
  TE.flatMapEither(decodeAndReportFailures(headCodec)),
  TE.map(({ link }) => link),
  TE.flatMapEither(docmapUri),
);
