import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { flow, pipe } from 'fp-ts/function';
import { Eq as stringEq } from 'fp-ts/string';
import {
  DoiFromLinkConfig, ServerData, isSupported, doiFromLinkConfig,
} from './doi-from-link-config.js';

const isPrefixOfASupportedServer = (allServerData: DoiFromLinkConfig, prefix: string) => pipe(
  allServerData,
  Object.values,
  RA.map((data: ServerData) => data.prefix),
  RA.elem(stringEq)(prefix),
);

const derivePrefixAndSuffixFromLink = (link: string) => {
  const [, prefix, suffix] = /.*\/(10\.[0-9]+)\/(.*)/.exec(link) ?? [];
  return {
    prefix,
    suffix,
  };
};

const deriveDoiFromDoiDotOrgLink = (allServerData: DoiFromLinkConfig, link: string) => pipe(
  link,
  derivePrefixAndSuffixFromLink,
  E.right,
  E.filterOrElse(
    ({ prefix }) => isPrefixOfASupportedServer(allServerData, prefix),
    ({ prefix }) => `not a supported server, prefix: ${prefix}`,
  ),
  E.filterOrElse(
    ({ suffix }) => suffix !== '',
    ({ prefix }) => `missing suffix, prefix: ${prefix}`,
  ),
  E.bimap(
    (error) => `${error} link: ${link}`,
    ({ prefix, suffix }) => `${prefix}/${suffix}`,
  ),
);

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
  const [, server] = /([a-z]+)\.(com|org|io)/.exec(link) ?? [];
  if (!server) {
    return E.left(`server not found in "${link}"`);
  }
  if (isSupported(server, doiFromLinkConfig)) {
    return deriveDoiForSpecificServer(doiFromLinkConfig[server], link);
  }
  switch (server) {
    case 'doi': return deriveDoiFromDoiDotOrgLink(doiFromLinkConfig, link);
    default:
      return E.left(`server "${server}" not supported in "${link}"`);
  }
};
