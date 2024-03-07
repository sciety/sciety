import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as t from 'io-ts';

export type RawUserInput = {
  content: string,
};

export const rawUserInput = (input: string): RawUserInput => ({
  content: input,
});

const isRawUserInput = (input: unknown): input is RawUserInput => typeof input === 'object' && input !== null && 'content' in input && typeof (input as RawUserInput).content === 'string';

export const rawUserInputCodec = new t.Type<RawUserInput, string, unknown>(
  'other Crossref type',
  isRawUserInput,
  (u, c) => pipe(
    t.string.validate(u, c),
    E.fold(
      () => t.failure(u, c),
      (val) => t.success(rawUserInput(val)),
    ),
  ),
  (a) => a.content,
);
