import { pipe } from 'fp-ts/function';

const stripTrailingDot = (s: string) => s.replace(/\.$/, '');

const addMedrxivOrBiorxivPrefix = (s: string) => `10.1101/${s}`;

const extractDoiSuffix = (link: string) => {
  const [, doiSuffix] = /.*\/([^/a-z]*).*$/.exec(link) ?? [];
  return doiSuffix;
};

export const medrxivOrBiorxivLinkToDoi = (link: string): string => pipe(
  link,
  extractDoiSuffix,
  stripTrailingDot,
  addMedrxivOrBiorxivPrefix,
);
