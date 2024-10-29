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
      const defaultValue = false;
      const result = pipe(
        'does not pass',
        withDefaultIfEmpty(tt.BooleanFromString, defaultValue).decode,
      );

      it('returns an error', () => {
        expect(result).toStrictEqual(E.left(expect.anything()));
      });
    });

    describe('given undefined', () => {
      const defaultValue = arbitraryString();
      const result = pipe(
        undefined,
        withDefaultIfEmpty(t.string, defaultValue).decode,
      );

      it('returns a default value', () => {
        expect(result).toStrictEqual(E.right(defaultValue));
      });
    });

    describe('given an empty string', () => {
      const defaultValue = arbitraryString();
      const result = pipe(
        '',
        withDefaultIfEmpty(t.string, defaultValue).decode,
      );

      it('returns a default value', () => {
        expect(result).toStrictEqual(E.right(defaultValue));
      });
    });
  });
});
