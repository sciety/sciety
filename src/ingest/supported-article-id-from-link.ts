import * as E from 'fp-ts/Either';
import { flow, pipe } from 'fp-ts/function';

const stripTrailingDot = (s: string) => s.replace(/\.$/, '');

const addMedrxivOrBiorxivPrefix = (s: string) => `10.1101/${s}`;

const extractDoiSuffix = (link: string) => {
  const [, doiSuffix] = /.*\/([^/a-z]*).*$/.exec(link) ?? [];
  if (!doiSuffix) {
    return E.left('nope');
  }
  return E.right(doiSuffix);
};

const doiFromLinkData = {
  researchsquare: {
    startOfDoi: '10.21203/rs.3.rs-',
  },
  scielo: {
    startOfDoi: '10.1590/SciELOPreprints.',
  },
};

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
      const match = /rs-(.*)$/.exec(link);
      if (match && match[1]) {
        return E.right(`${doiFromLinkData.researchsquare.startOfDoi}${match[1]}`);
      }

      return E.left(`link not parseable: "${link}"`);
    }
    case 'scielo': {
      const match = /download\/(\d+)\//.exec(link);
      if (match && match[1]) {
        return E.right(`${doiFromLinkData.scielo.startOfDoi}${match[1]}`);
      }

      return E.left(`link not parseable: "${link}"`);
    }
    default:
      return E.left(`server "${server}" not supported in "${link}"`);
  }
};
