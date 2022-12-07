import * as E from 'fp-ts/Either';
import { userGeneratedInputCodec } from '../../../src/types/codecs/user-generated-input-codec';

describe('user-generated-input-codec', () => {
  const result = userGeneratedInputCodec.decode('<script>');

  it('fails when supplied with script tag', () => {
    expect(E.isLeft(result)).toBe(true);
  });
});
