import * as E from 'fp-ts/Either';
import { userGeneratedInputCodec } from '../../../src/types/codecs/user-generated-input-codec';

describe('user-generated-input-codec', () => {
  it('fails when supplied with script tag', () => {
    const result = userGeneratedInputCodec(100).decode('<script>');

    expect(E.isLeft(result)).toBe(true);
  });

  it('fails when supplied with an empty string', () => {
    const result = userGeneratedInputCodec(100).decode('');

    expect(E.isLeft(result)).toBe(true);
  });

  it('passes when supplied with a non blacklisted character é', () => {
    const result = userGeneratedInputCodec(100).decode('é');

    expect(E.isRight(result)).toBe(true);
  });

  it('passes when supplied with a non blacklisted special character', () => {
    const result = userGeneratedInputCodec(100).decode('Some articles?');

    expect(E.isRight(result)).toBe(true);
  });
});
