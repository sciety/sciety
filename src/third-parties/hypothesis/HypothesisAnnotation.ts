import * as t from 'io-ts';

export const hypothesisAnnotation = t.type({
  text: t.string, // TODO HtmlFragment
  links: t.type({
    incontext: t.string, // TODO URL
  }),
  target: t.array(t.type({
    selector: t.union([
      t.undefined,
      t.array(t.union([
        t.type({
          type: t.literal('RangeSelector'),
        }),
        t.type({
          type: t.literal('PageSelector'),
        }),
        t.type({
          type: t.literal('TextPositionSelector'),
        }),
        t.type({
          type: t.literal('TextQuoteSelector'),
          exact: t.string,
        }),
      ])),
    ]),
  })),
}, 'hypothesisAnnotation');

export type HypothesisAnnotation = t.TypeOf<typeof hypothesisAnnotation>;
