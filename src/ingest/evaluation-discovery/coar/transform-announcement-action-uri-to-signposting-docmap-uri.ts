import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { Dependencies } from '../../discover-published-evaluations';
import { fetchHead } from '../../fetch-head';
import { generateConfigurationFromEnvironment } from '../../generate-configuration-from-environment';
import { decodeAndReportFailures } from '../decode-and-report-failures';

const headersLinkCodec = t.strict({
  link: t.string,
});

const quickWireuoOfFetchHead = (uri: string) => pipe(
  process.env,
  generateConfigurationFromEnvironment,
  E.mapLeft(() => 'Failed to generate ingestion configuration'),
  TE.fromEither,
  TE.map(fetchHead),
  TE.flatMap((performfetchHead) => performfetchHead(uri)),
);

export const transformAnnouncementActionUriToSignpostingDocmapUri = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dependencies: Dependencies,
) => (
  announcementActionUri: string,
): TE.TaskEither<string, string> => pipe(
  announcementActionUri,
  quickWireuoOfFetchHead,
  TE.flatMapEither(decodeAndReportFailures(headersLinkCodec)),
  TE.map(({ link }) => link.split(/,\s+/)),
  TE.map(RA.filter((link) => link.match(/\stype="application\/ld\+json"/) !== null)),
  TE.map(RA.filter((link) => link.match(/^.*<(http[^]+)>.*$/) !== null)),
  TE.map(RA.map((link) => link.replace(/^.*<(http[^]+)>.*$/, '$1'))),
  TE.map(RA.last),
  TE.flatMap(TE.fromOption(() => 'Link header does not contain a Signposting DocMap URI')),
);
