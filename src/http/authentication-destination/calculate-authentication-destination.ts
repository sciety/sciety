import { pipe } from 'fp-ts/function';
import { URL } from 'url';
import * as O from 'fp-ts/Option';

// ts-unused-exports:disable-next-line
export const defaultDestination = '/';

export const calculateAuthenticationDestination = (referer: string | undefined, applicationHostname: string) => pipe(
  referer,
  O.fromNullable,
  O.map((url) => new URL(url)),
  O.map((url) => (url.hostname === applicationHostname ? url.toString() : defaultDestination)),
  O.getOrElse(() => defaultDestination),
);
