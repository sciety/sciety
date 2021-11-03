import * as t from 'io-ts';

export const hypothesisAnnotation = t.type({
  text: t.string, // TODO HtmlFragment
  links: t.type({
    incontext: t.string, // TODO URL
  }),
});

export type HypothesisAnnotation = t.TypeOf<typeof hypothesisAnnotation>;
