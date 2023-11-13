import { URL } from 'url';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { Logger } from '../../shared-ports';

export const defaultDestination = '/';

const toValidUrl = (candidateUrl: string) => pipe(
  O.tryCatch(() => new URL(candidateUrl)),
);

const isHostedBy = (applicationHostname: string) => (url: URL) => url.hostname === applicationHostname;

const urlToString = (url: URL) => url.toString();

export const calculateAuthenticationDestination = (
  logger: Logger, referer: string | undefined, applicationHostname: string,
): string => pipe(
  referer,
  O.fromNullable,
  O.chain(toValidUrl),
  O.filter(isHostedBy(applicationHostname)),
  O.map(urlToString),
  O.getOrElse(() => defaultDestination),
);
