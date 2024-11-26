import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { flow, pipe } from 'fp-ts/function';
import { Eq as stringEq } from 'fp-ts/string';
import {
  ExpressionDoiFromUriConfig, PaperServerConfiguration, isSupported, expressionDoiFromUriConfig,
} from './expression-doi-from-uri-config';

const isPrefixOfASupportedServer = (config: ExpressionDoiFromUriConfig, prefix: string) => pipe(
  config,
  Object.values,
  RA.map((paperServerConfiguration: PaperServerConfiguration) => paperServerConfiguration.prefix),
  RA.elem(stringEq)(prefix),
);

const derivePrefixAndSuffixFromUri = (uri: string) => {
  const [, prefix, suffix] = /.*\/(10\.[0-9]+)\/(.*)/.exec(uri) ?? [];
  return {
    prefix,
    suffix,
  };
};

const deriveDoiFromDoiDotOrgUri = (config: ExpressionDoiFromUriConfig, uri: string) => pipe(
  uri,
  derivePrefixAndSuffixFromUri,
  E.right,
  E.filterOrElse(
    ({ prefix }) => isPrefixOfASupportedServer(config, prefix),
    ({ prefix }) => `not a supported server, prefix: ${prefix}`,
  ),
  E.filterOrElse(
    ({ suffix }) => suffix !== '',
    ({ prefix }) => `missing suffix, prefix: ${prefix}`,
  ),
  E.bimap(
    (error) => `${error} uri: ${uri}`,
    ({ prefix, suffix }) => `${prefix}/${suffix}`,
  ),
);

const deriveDoiForSpecificServer = (serverData: PaperServerConfiguration, uri: string) => pipe(
  uri,
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
    (error) => `uri not parseable due to "${error}": "${uri}"`,
    (endOfDoi) => `${serverData.startOfDoi}${endOfDoi}`,
  ),
);

export const supportedExpressionDoiFromUri = (uri: string): E.Either<string, string> => {
  const [, server] = /([a-z]+)\.(com|org|io)/.exec(uri) ?? [];
  if (!server) {
    return E.left(`server not found in "${uri}"`);
  }
  if (isSupported(server, expressionDoiFromUriConfig)) {
    return deriveDoiForSpecificServer(expressionDoiFromUriConfig[server], uri);
  }
  switch (server) {
    case 'doi': return deriveDoiFromDoiDotOrgUri(expressionDoiFromUriConfig, uri);
    default:
      return E.left(`server "${server}" not supported in "${uri}"`);
  }
};
