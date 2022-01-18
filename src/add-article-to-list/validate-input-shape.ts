import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as PR from 'io-ts/PathReporter';
import { DoiFromString } from '../types/codecs/DoiFromString';
import { Doi } from '../types/doi';
import { ListId } from '../types/list-id';

type Command = {
  articleId: Doi,
  listId: ListId,
};

const inputCodec = t.type({
  articleId: DoiFromString,
  listId: t.string,
});

type ValidateInputShape = (input: unknown) => E.Either<string, Command>;

export const validateInputShape: ValidateInputShape = (input) => pipe(
  input,
  inputCodec.decode,
  E.mapLeft((errors) => PR.failure(errors).join('\n')),
);
