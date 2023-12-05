import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';

export const isDoi = (input: unknown): input is PaperIdThatIsADoi => typeof input === 'string' && input.startsWith('doi:');

const doiRegex = /^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;

export const paperIdThatIsADoiCodec = new t.Type<PaperIdThatIsADoi, string, unknown>(
  'paperIdThatIsADoi',
  isDoi,
  (u, c) => pipe(
    t.string.validate(u, c),
    E.chain(flow(
      O.fromPredicate((value) => doiRegex.test(value)),
      O.fold(
        () => t.failure(u, c),
        (id) => t.success(`doi:${id}` as PaperIdThatIsADoi),
      ),
    )),
  ),
  (a) => a.toString(),
);

export type PaperIdThatIsADoi = string & { readonly PaperIdThatIsADoi: unique symbol };
