import * as uuid from 'uuid';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';

type PaperIdThatIsAUuid = string & { readonly PaperIdThatIsAUuid: unique symbol };

export const isUuid = (input: unknown): input is PaperIdThatIsAUuid => typeof input === 'string' && input.startsWith('uuid:');

export const paperIdThatIsAUuidCodec = new t.Type<PaperIdThatIsAUuid, string, unknown>(
  'paperIdThatIsAUuid',
  isUuid,
  (u, c) => pipe(
    t.string.validate(u, c),
    E.chain(flow(
      O.fromPredicate(uuid.validate),
      O.fold(
        () => t.failure(u, c),
        (id) => t.success(`uuid:${id}` as PaperIdThatIsAUuid),
      ),
    )),
  ),
  (a) => a.toString(),
);
