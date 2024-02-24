import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { formatValidationErrors } from 'io-ts-reporters';
import { UpdateUserDetailsCommand, updateUserDetailsCommandCodec } from '../../../src/write-side/commands/index.js';
import { abortTest } from '../../framework/abort-test.js';

export const constructUpdateUserDetailsCommand = (input: unknown): UpdateUserDetailsCommand => pipe(
  input,
  updateUserDetailsCommandCodec.decode,
  E.mapLeft(formatValidationErrors),
  E.getOrElseW(abortTest('constructUpdateUserDetailsCommand')),
);
