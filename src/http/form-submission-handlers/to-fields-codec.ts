import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';

export const toFieldsCodec = <P extends t.Props>(
  props: P, name: string,
): t.TypeC<{ [K in keyof P]: t.StringC }> => pipe(
    props,
    R.map(() => t.string),
    (stringProps) => stringProps as {
      [K in keyof P]: t.StringC;
    },
    (p) => t.type(p, name),
  );
