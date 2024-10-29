import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { arbitraryString } from './helpers';
import { withDefaultIfEmpty } from '../src/environment-variables';

describe('environment-variables', () => {
  describe('withDefaultIfEmpty', () => {
    describe('given a non-empty string that passes the codec', () => {
      const stringInput = arbitraryString();
      const defaultValue = arbitraryString();
      const result = pipe(
        stringInput,
        withDefaultIfEmpty(t.string, defaultValue).decode,
      );

      it('returns the decoded value', () => {
        expect(result).toStrictEqual(E.right(stringInput));
      });
    });

    describe('given a non-empty string that does not pass the codec', () => {
      const stringInput = 'will not pass';
      const defaultValue = false;
      const codec = tt.BooleanFromString;
      const result = pipe(
        stringInput,
        withDefaultIfEmpty(codec, defaultValue).decode,
      );

      it('returns an error', () => {
        expect(result).toStrictEqual(E.left(expect.anything()));
      });
    });

    describe('given undefined', () => {
      it.todo('returns a default value');
    });

    describe('given an empty string', () => {
      it.todo('returns a default value');
    });
  });
});
