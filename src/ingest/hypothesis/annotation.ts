import * as t from 'io-ts';

export const annotationFromJson = t.type({
  id: t.string,
  created: t.string, // TODO: should be tt.DateFromISOString
  uri: t.string,
});

export type Annotation = t.TypeOf<typeof annotationFromJson>;
