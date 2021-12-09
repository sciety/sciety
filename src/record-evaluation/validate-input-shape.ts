import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as PR from 'io-ts/PathReporter';
import { Command } from './raise-events-if-necessary';
import { DoiFromString } from '../types/codecs/DoiFromString';
import { GroupIdFromString } from '../types/codecs/GroupIdFromString';
import { reviewIdCodec } from '../types/review-id';

const inputCodec = t.type({
  groupId: GroupIdFromString,
  publishedAt: tt.DateFromISOString,
  evaluationLocator: reviewIdCodec,
  articleId: DoiFromString,
  authors: t.readonlyArray(t.string),
});

type ValidateInputShape = (input: unknown) => E.Either<string, Command>;

export const validateInputShape: ValidateInputShape = (input) => pipe(
  input,
  inputCodec.decode,
  E.mapLeft((errors) => PR.failure(errors).join('\n')),
);
