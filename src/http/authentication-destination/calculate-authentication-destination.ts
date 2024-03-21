import { URL } from 'url';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { Logger } from '../../infrastructure-contract';

export const defaultDestination = '/';

const toValidUrl = (candidateUrl: string) => O.tryCatch(() => new URL(candidateUrl));

const isHostedBy = (applicationHostname: string) => (url: URL) => url.hostname === applicationHostname;

const urlToString = (url: URL) => url.toString();

export const calculateAuthenticationDestination = (
  logger: Logger, referer: string | undefined, applicationHostname: string,
): string => pipe(
  referer,
  O.fromNullable,
  O.filter((candidateUrl) => candidateUrl !== ''),
  O.chain(toValidUrl),
  O.filter(isHostedBy(applicationHostname)),
  O.map(urlToString),
  O.getOrElse(() => {
    logger('error', "Can't use the referer as an authentication destination", { referer });
    return defaultDestination;
  }),
);
