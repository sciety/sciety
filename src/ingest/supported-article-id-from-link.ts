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

export const supportedArticleIdFromLink = (link: string): E.Either<string, string> => {
  const [, server] = /([a-z]+)\.(com|org)/.exec(link) ?? [];
  if (!server) {
    return E.left(`server not found in "${link}"`);
  }
  switch (server) {
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
      const [, suffix] = /rs-(.*)$/.exec(link) ?? [];
      return E.right(`10.21203/rs.3.rs-${suffix}`);
    }
    default:
      return E.left(`server "${server}" not supported in "${link}"`);
  }
};
