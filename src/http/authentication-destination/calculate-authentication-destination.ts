import { URL } from 'url';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { Logger } from '../../infrastructure';

export const defaultDestination = '/';

const toValidUrl = (logger: Logger) => (candidateUrl: string) => pipe(
  O.tryCatch(() => new URL(candidateUrl)),
  (url) => {
    if (O.isNone(url)) {
      logger('error', 'Referer is not a valid URL', { candidateUrl });
    }
    return url;
  },
);

const isHostedBy = (applicationHostname: string) => (url: URL) => url.hostname === applicationHostname;

const urlToString = (url: URL) => url.toString();

export const calculateAuthenticationDestination = (
  logger: Logger, referer: string | undefined, applicationHostname: string,
): string => pipe(
  referer,
  O.fromNullable,
  O.filter((candidateUrl) => candidateUrl !== ''),
  O.chain(toValidUrl(logger)),
  O.filter(isHostedBy(applicationHostname)),
  O.map(urlToString),
  O.getOrElse(() => defaultDestination),
);
