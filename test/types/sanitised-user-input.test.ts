import * as E from 'fp-ts/Either';
import { sanitisedUserInputCodec } from '../../src/types/sanitised-user-input.js';
import { arbitraryWord } from '../helpers.js';

describe('sanitised-user-input', () => {
  it('fails when supplied with script tag', () => {
    const result = sanitisedUserInputCodec({ maxInputLength: 100 }).decode('<script>');

    expect(E.isLeft(result)).toBe(true);
  });

  it('passes when supplied with a permitted character é', () => {
    const result = sanitisedUserInputCodec({ maxInputLength: 100 }).decode('é');

    expect(E.isRight(result)).toBe(true);
  });

  it('passes when supplied with a permitted special character', () => {
    const result = sanitisedUserInputCodec({ maxInputLength: 100 }).decode('Some articles?');

    expect(E.isRight(result)).toBe(true);
  });

  it('fails when supplied with a string that is too long', () => {
    const result = sanitisedUserInputCodec({ maxInputLength: 10 }).decode(arbitraryWord(11));

    expect(E.isLeft(result)).toBe(true);
  });

  describe('when an empty input is not allowed', () => {
    it('fails when supplied with an empty string', () => {
      const result = sanitisedUserInputCodec({ maxInputLength: 100 }).decode('');

      expect(E.isLeft(result)).toBe(true);
    });
  });

  describe('when an empty input is allowed', () => {
    it('does not fail when supplied with an empty string', () => {
      const result = sanitisedUserInputCodec({ maxInputLength: 100, allowEmptyInput: true }).decode('');

      expect(E.isRight(result)).toBe(true);
    });
  });
});
