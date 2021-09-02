import * as t from 'io-ts';

const annotationFromJson = t.type({
  id: t.string,
  created: t.string, // TODO: should be tt.DateFromISOString
  uri: t.string,
});

export type Annotation = t.TypeOf<typeof annotationFromJson>;

export const responseFromJson = t.type({
  rows: t.array(annotationFromJson),
});

export type Response = t.TypeOf<typeof responseFromJson>;
