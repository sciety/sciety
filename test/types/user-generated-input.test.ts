import * as E from 'fp-ts/Either';
import { userGeneratedInputCodec } from '../../src/types/user-generated-input';
import { arbitraryWord } from '../helpers';

describe('user-generated-input', () => {
  it('fails when supplied with script tag', () => {
    const result = userGeneratedInputCodec({ maxLength: 100 }).decode('<script>');

    expect(E.isLeft(result)).toBe(true);
  });

  it('passes when supplied with a permitted character é', () => {
    const result = userGeneratedInputCodec({ maxLength: 100 }).decode('é');

    expect(E.isRight(result)).toBe(true);
  });

  it('passes when supplied with a permitted special character', () => {
    const result = userGeneratedInputCodec({ maxLength: 100 }).decode('Some articles?');

    expect(E.isRight(result)).toBe(true);
  });

  it('fails when supplied with a string that is too long', () => {
    const result = userGeneratedInputCodec({ maxLength: 10 }).decode(arbitraryWord(11));

    expect(E.isLeft(result)).toBe(true);
  });

  describe('when an empty input is not allowed', () => {
    it('fails when supplied with an empty string', () => {
      const result = userGeneratedInputCodec({ maxLength: 100 }).decode('');

      expect(E.isLeft(result)).toBe(true);
    });
  });

  describe('when an empty input is allowed', () => {
    it('does not fail when supplied with an empty string', () => {
      const result = userGeneratedInputCodec({ maxLength: 100, emptyInput: true }).decode('');

      expect(E.isRight(result)).toBe(true);
    });
  });
});
