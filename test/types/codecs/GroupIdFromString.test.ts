import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { GroupIdFromString } from '../../../src/types/codecs/GroupIdFromString';
import { arbitraryGroupId } from '../group-id.helper';

describe('codec GroupIdFromString', () => {
  it('encodes and decodes back to the same value', () => {
    const id = arbitraryGroupId();

    expect(pipe(
      id,
      GroupIdFromString.encode,
      GroupIdFromString.decode,
    )).toStrictEqual(E.right(id));
  });
});
