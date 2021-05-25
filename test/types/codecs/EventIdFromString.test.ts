import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { EventIdFromString } from '../../../src/types/codecs/EventIdFromString';
import { generate } from '../../../src/types/event-id';

describe('codec EventIdFromString', () => {
  it('encodes and decodes back to the same value', () => {
    const id = generate();

    expect(pipe(
      id,
      EventIdFromString.encode,
      EventIdFromString.decode,
    )).toStrictEqual(E.right(id));
  });
});
