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

export const medrxivOrBiorxivLinkToDoi = (link: string): E.Either<string, string> => pipe(
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
