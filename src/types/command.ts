import { htmlEscape, htmlUnescape } from 'escape-goat';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { JsonFromString } from 'io-ts-types';

import { DoiFromString } from './codecs/DoiFromString';

export const commandCodec = t.type({
  articleId: DoiFromString,
  type: t.union([
    t.literal('UnsaveArticle'),
    t.literal('SaveArticle'),
  ]),
});

export type Command = t.TypeOf<typeof commandCodec>;

const isCommand = (input: unknown): input is Command => {
  if (typeof input !== 'string') {
    return false;
  }

  return pipe(
    input,
    JSON.parse,
    commandCodec.decode,
    E.isRight,
  );
};

export const CommandFromString = new t.Type<Command, string, unknown>(
  'CommandFromString',
  isCommand,
  (input, context) => pipe(
    t.string.validate(input, context),
    E.map((hackForTypeInference) => htmlUnescape(hackForTypeInference)),
    E.chain(JsonFromString.decode),
    E.chain(commandCodec.decode),
  ),
  (command) => pipe(
    {
      articleId: DoiFromString.encode(command.articleId),
      type: command.type,
    },
    JsonFromString.encode,
    (hackForTypeInference) => htmlEscape(hackForTypeInference),
  ),
);
