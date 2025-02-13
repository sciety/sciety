import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { arbitraryDate, arbitraryString } from '../../helpers';

const disallow = <P extends t.Props>(orig: t.TypeC<P>): t.TypeC<P> => orig;

describe('disallow-unknown-keys', () => {
  describe('given an input object with unspecified keys and a type codec', () => {
    const unspecified = 'unspecified-value';
    const input = {
      foo: arbitraryString(),
      bar: arbitraryDate().toISOString(),
      unspecified,
    };

    const baseCodec = t.type({
      foo: t.string,
      bar: tt.DateFromISOString,
    });

    describe('using the type codec', () => {
      const result = pipe(
        input,
        baseCodec.decode,
      );

      it('decodes successfully', () => {
        expect(result).toStrictEqual(E.right(expect.anything()));
      });

      it('allows unspecified keys to be accessed at runtime', () => {
        expect(result).toStrictEqual(E.right(expect.objectContaining({ unspecified })));
      });
    });

    describe('wrapping the codec with `exact`', () => {
      const result = pipe(
        input,
        t.exact(baseCodec).decode,
      );

      it('decodes successfully', () => {
        expect(result).toStrictEqual(E.right(expect.anything()));
      });

      it('makes unspecified keys inaccessible at runtime', () => {
        expect(result).toStrictEqual(E.right(expect.not.objectContaining({ unspecified })));
      });
    });

    describe('using an equivalent `strict` codec', () => {
      const exactWrapped = t.exact(baseCodec);
      type ExactWrapped = typeof exactWrapped;
      const equivalentCodec: ExactWrapped = t.strict({
        foo: t.string,
        bar: tt.DateFromISOString,
      });

      const result = pipe(
        input,
        equivalentCodec.decode,
      );

      it('decodes successfully', () => {
        expect(result).toStrictEqual(E.right(expect.anything()));
      });

      it('makes unspecified keys inaccessible at runtime', () => {
        expect(result).toStrictEqual(E.right(expect.not.objectContaining({ unspecified })));
      });
    });

    describe('wrapping the codec with `disallow`', () => {
      const result = pipe(
        input,
        disallow(baseCodec).decode,
      );

      it.failing('fails to decode', () => {
        expect(result).toStrictEqual(E.left(expect.anything()));
      });
    });
  });
});
