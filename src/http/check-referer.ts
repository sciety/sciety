import { pipe } from 'fp-ts/function';
import { URL } from 'url';
import * as O from 'fp-ts/Option';

export const checkReferer = (referer: string | undefined) => pipe(
  referer,
  O.fromNullable,
  O.map((url) => new URL(url)),
  O.map((url) => (['sciety.org', 'localhost', 'staging.sciety.org'].includes(url.hostname) ? url.toString() : '/')),
  O.getOrElse(() => '/'),
);
