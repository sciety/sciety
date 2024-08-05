import * as t from 'io-ts';

export const annotationCodec = t.type({
  id: t.string,
  created: t.string, // TODO: should be tt.DateFromISOString
  uri: t.string,
  text: t.string,
  tags: t.array(t.string),
});

export type Annotation = t.TypeOf<typeof annotationCodec>;
