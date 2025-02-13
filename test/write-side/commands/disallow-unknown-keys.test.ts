import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { codec } from '../../../src/third-parties/fetch-publishing-history/fetch-all-paper-expressions-from-crossref/date-stamp';
import { arbitraryDate, arbitraryString } from '../../helpers';

function getProps(inputCodec: t.HasProps): t.Props {
  switch (inputCodec._tag) {
    case 'RefinementType':
    case 'ReadonlyType':
      return getProps(inputCodec.type);
    case 'InterfaceType':
    case 'StrictType':
    case 'PartialType':
      return inputCodec.props as t.Props;
    case 'IntersectionType':
      return inputCodec.types.reduce<t.Props>((props, type) => Object.assign(props, getProps(type)), {});
  }
}

const disallow = <C extends t.HasProps>(originalCodec: C, name: string = codec.name): t.ExactC<C> => {
  const allowedKeys = Object.getOwnPropertyNames(getProps(originalCodec));

  return new t.ExactType(
    name,
    originalCodec.is,
    (input, context) => {
      const record = t.UnknownRecord.validate(input, context);
      if (E.isLeft(record)) {
        return record;
      }
      const keysOfInput = Object.getOwnPropertyNames(input);
      // eslint-disable-next-line no-loops/no-loops, no-plusplus
      for (let i = 0; i < keysOfInput.length; i++) {
        const key = keysOfInput[i];
        if (!allowedKeys.includes(key)) {
          return t.failure(input, context, `'${key}' is an unexpected key name`);
        }
      }
      return t.exact(originalCodec).validate(input, context);
    },
    (a) => t.exact(originalCodec).encode(a) as t.ExactC<C>,
    originalCodec,
  );
};

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

      it('fails to decode', () => {
        expect(result).toStrictEqual(E.left(expect.anything()));
      });
    });
  });
});
