import * as t from 'io-ts';

export const codec = t.strict({
  'date-parts': t.readonlyArray(t.union([
    t.tuple([t.number, t.number, t.number]),
    t.tuple([t.number, t.number]),
    t.tuple([t.number]),
  ])),
});

export type DateStamp = t.TypeOf<typeof codec>;

export const toDate = (date: DateStamp): Date => {
  const dateParts = date['date-parts'][0];
  return new Date(
    dateParts[0],
    dateParts[1] ? dateParts[1] - 1 : 0,
    dateParts[2] ?? 1,
  );
};
