import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import escapeRegExp from 'lodash.escaperegexp';
import { Dependencies } from '../../discover-published-evaluations';
import { decodeAndReportFailures } from '../decode-and-report-failures';

const headCodec = t.strict({
  link: t.string,
});

const testLinkWithRegexp = (
  regexp: RegExp,
) => (
  link: string,
) => regexp.test(link);

const linkHasAttribute = (
  attribute: 'rel' | 'profile',
  value: string,
) => testLinkWithRegexp(new RegExp(`(^|\\s)${attribute}="${escapeRegExp(value)}"`));

const linkHasUri = testLinkWithRegexp(/<http[^>]+>/);

const linkHasDocmapUriRegex = (link: string) => pipe(
  O.some(link),
  O.filter(linkHasUri),
  O.filter(linkHasAttribute('rel', 'describedby')),
  O.filter(linkHasAttribute('profile', 'https://w3id.org/docmaps/context.jsonld')),
  O.map(
    (linkWithDocmapUri) => linkWithDocmapUri.replace(/^.*<(http[^>]+)>.*$/, '$1'),
  ),
);

const docmapUri = (
  headerLink: string,
) => pipe(
  headerLink.split(/,\s*/),
  RA.findFirstMap(linkHasDocmapUriRegex),
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
