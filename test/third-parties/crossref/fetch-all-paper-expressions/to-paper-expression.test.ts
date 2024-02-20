import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { SupportedCrossrefWork } from '../../../../src/third-parties/crossref/fetch-all-paper-expressions/crossref-work';
import { toPaperExpression } from '../../../../src/third-parties/crossref/fetch-all-paper-expressions/to-paper-expression';
import { arbitraryString, arbitraryUri } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';

describe('to-paper-expression', () => {
  describe('when the Crossref work is of type posted-content', () => {
    const crossrefWork: SupportedCrossrefWork = {
      type: 'posted-content',
      DOI: arbitraryString(),
      posted: { 'date-parts': [[2021, 10, 3]] },
      resource: { primary: { URL: arbitraryUri() } },
      relation: { },
    };
    const expressionType = pipe(
      crossrefWork,
      toPaperExpression,
      E.getOrElseW(shouldNotBeCalled),
      (expression) => expression.expressionType,
    );

    it('returns an expression of type preprint', () => {
      expect(expressionType).toBe('preprint');
    });
  });

  describe('when the Crossref work is of type journal-article', () => {
    const crossrefWork: SupportedCrossrefWork = {
      type: 'journal-article',
      DOI: arbitraryString(),
      published: { 'date-parts': [[2021, 10, 3]] },
      resource: { primary: { URL: arbitraryUri() } },
      relation: { },
    };
    const expressionType = pipe(
      crossrefWork,
      toPaperExpression,
      E.getOrElseW(shouldNotBeCalled),
      (expression) => expression.expressionType,
    );

    it('returns an expression of type journal-article', () => {
      expect(expressionType).toBe('journal-article');
    });
  });

  describe('when the Crossref work is of type component', () => {
    it.todo('rejects the work');
  });
});
