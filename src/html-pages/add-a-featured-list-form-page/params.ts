import * as t from 'io-ts';

export const paramsCodec = t.type({
  slug: t.string,
});

export type Params = t.TypeOf<typeof paramsCodec>;
