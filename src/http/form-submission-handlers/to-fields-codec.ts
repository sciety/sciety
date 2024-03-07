import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { rawUserInputCodec } from '../../read-side/raw-user-input';

export const toRawFormCodec = <P extends t.Props>(
  props: P, name: string,
): t.TypeC<{ [K in keyof P]: typeof rawUserInputCodec }> => pipe(
    props,
    R.map(() => rawUserInputCodec),
    (rawUserInputProps) => rawUserInputProps as {
      [K in keyof P]: typeof rawUserInputCodec;
    },
    (p) => t.type(p, name),
  );
