import { URL } from 'url';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';

export const defaultDestination = '/';

export const calculateAuthenticationDestination = (
  referer: string | undefined, applicationHostname: string,
): string => pipe(
  referer,
  O.fromNullable,
  O.map((url) => new URL(url)),
  O.filter((url) => url.hostname === applicationHostname),
  O.map((url) => url.toString()),
  O.getOrElse(() => defaultDestination),
);
