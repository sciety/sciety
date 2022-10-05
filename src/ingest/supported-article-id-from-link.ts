import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { flow, pipe } from 'fp-ts/function';

const stripTrailingDot = (s: string) => s.replace(/\.$/, '');

const addMedrxivOrBiorxivPrefix = (s: string) => `10.1101/${s}`;

const extractDoiSuffix = (link: string) => {
  const [, doiSuffix] = /.*\/((?:\d{4}\.\d{2}\.\d{2}\.)?\d+).*/.exec(link) ?? [];
  if (!doiSuffix) {
    return E.left('nope');
  }
  return E.right(doiSuffix);
};

const doiFromLinkData = {
  researchsquare: {
    startOfDoi: '10.21203/rs.3.rs-',
    regexToCaptureEndOfDoi: /rs-(.*)$/,
  },
  scielo: {
    startOfDoi: '10.1590/SciELOPreprints.',
    regexToCaptureEndOfDoi: /download\/(\d+)\//,
  },
};

type ServerData = {
  startOfDoi: string,
  regexToCaptureEndOfDoi: RegExp,
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

export const supportedArticleIdFromLink = (link: string): E.Either<string, string> => {
  const [, server] = /([a-z]+)\.(com|org)/.exec(link) ?? [];
  if (!server) {
    return E.left(`server not found in "${link}"`);
  }
  switch (server) {
    case 'doi': {
      const [, prefix, suffix] = /.*\/(10\.[0-9]+)\/(.*)/.exec(link) ?? [];
      switch (prefix) {
        case '10.1101':
        case '10.21203':
          return E.right(`${prefix}/${suffix}`);
        default:
          return E.left(`link "${link}" not a supported server`);
      }
    }
    case 'biorxiv':
    case 'medrxiv':
      return pipe(
        link,
        extractDoiSuffix,
        E.bimap(
          () => `link not parseable for DOI: "${link}"`,
          flow(
            stripTrailingDot,
            addMedrxivOrBiorxivPrefix,
          ),
        ),
      );
    case 'researchsquare': {
      return deriveDoiForSpecificServer(doiFromLinkData.researchsquare, link);
    }
    case 'scielo': {
      return deriveDoiForSpecificServer(doiFromLinkData.scielo, link);
    }
    default:
      return E.left(`server "${server}" not supported in "${link}"`);
  }
};
