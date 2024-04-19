import * as t from 'io-ts';

export const addAFeaturedListFormPageParamsCodec = t.type({
  slug: t.string,
});

export type Params = t.TypeOf<typeof addAFeaturedListFormPageParamsCodec>;
