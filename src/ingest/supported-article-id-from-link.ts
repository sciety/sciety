import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { flow, pipe } from 'fp-ts/function';
import { Eq as stringEq } from 'fp-ts/string';

const doiFromLinkData: DoiFromLinkData = {
  researchsquare: {
    startOfDoi: '10.21203/rs.3.rs-',
    regexToCaptureEndOfDoi: /rs-(.*)$/,
    prefix: '10.21203',
  },
  scielo: {
    startOfDoi: '10.1590/SciELOPreprints.',
    regexToCaptureEndOfDoi: /download\/(\d+)\//,
    prefix: '10.1590',
  },
  biorxiv: {
    startOfDoi: '10.1101/',
    regexToCaptureEndOfDoi: /.*\/((?:\d{4}\.\d{2}\.\d{2}\.)?\d+).*/,
    prefix: '10.1101',
  },
  medrxiv: {
    startOfDoi: '10.1101/',
    regexToCaptureEndOfDoi: /.*\/((?:\d{4}\.\d{2}\.\d{2}\.)?\d+).*/,
    prefix: '10.1101',
  },
};

type ServerData = {
  startOfDoi: string,
  regexToCaptureEndOfDoi: RegExp,
  prefix: string,
};

type SupportedServerName = 'researchsquare' | 'scielo' | 'biorxiv' | 'medrxiv';

type DoiFromLinkData = Record<SupportedServerName, ServerData>;

const deriveDoiFromDoiDotOrgLink = (allServerData: DoiFromLinkData, link: string) => {
  const [, prefix, suffix] = /.*\/(10\.[0-9]+)\/(.*)/.exec(link) ?? [];
  if (suffix === '') {
    return E.left(`missing suffix, prefix: ${prefix}, link: ${link}`);
  }
  return pipe(
    allServerData,
    Object.values,
    RA.map((data: ServerData) => data.prefix),
    E.right,
    E.filterOrElse(
      RA.elem(stringEq)(prefix),
      () => 'not a supported server',
    ),
    E.bimap(
      (error) => `${error}, prefix: ${prefix}, link: ${link}`,
      () => `${prefix}/${suffix}`,

    ),
  );
};
const deriveDoiForSpecificServer = (serverData: ServerData, link: string) => pipe(
  link,
  (input) => serverData.regexToCaptureEndOfDoi.exec(input),
  E.fromNullable('regex failed'),
  E.chain(
    flow(
      RA.lookup(1),
      E.fromOption(() => 'no first capture group in regex match'),
    ),
  ),
  E.filterOrElse(
    (captureGroup) => captureGroup.length >= 1,
    () => 'capture group for endOfDoi is empty',
  ),
  E.bimap(
    (error) => `link not parseable due to "${error}": "${link}"`,
    (endOfDoi) => `${serverData.startOfDoi}${endOfDoi}`,
  ),
);

const isSupported = (server: string, allServerData: DoiFromLinkData): server is SupportedServerName => pipe(
  allServerData,
  Object.keys,
  RA.elem(stringEq)(server),
);

export const supportedArticleIdFromLink = (link: string): E.Either<string, string> => {
  const [, server] = /([a-z]+)\.(com|org)/.exec(link) ?? [];
  if (!server) {
    return E.left(`server not found in "${link}"`);
  }
  if (isSupported(server, doiFromLinkData)) {
    return deriveDoiForSpecificServer(doiFromLinkData[server], link);
  }
  switch (server) {
    case 'doi': return deriveDoiFromDoiDotOrgLink(doiFromLinkData, link);
    default:
      return E.left(`server "${server}" not supported in "${link}"`);
  }
};
