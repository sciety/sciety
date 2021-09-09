import * as E from 'fp-ts/Either';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';

// ts-unused-exports:disable-next-line
export const dateFromIngressLogString = new t.Type(
  'dateFromIngressLogString ',
  (input): input is Date => input instanceof Date,
  (input, context) => pipe(
    t.string.validate(input, context),
    E.chain(flow(
      (str) => str.replace(/:/, ' '),
      tt.DateFromISOString.decode,
    )),
  ),
  (date) => date.toString(),
);
