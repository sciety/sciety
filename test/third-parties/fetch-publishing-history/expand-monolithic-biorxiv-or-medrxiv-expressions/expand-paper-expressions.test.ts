import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import {
  GetExpressionsFromBiorxiv,
  expandPaperExpressions,
} from '../../../../src/third-parties/fetch-publishing-history/expand-monolithic-biorxiv-or-medrxiv-expressions/expand-paper-expressions';
import { ArticleServer } from '../../../../src/types/article-server';
import { PaperExpression } from '../../../../src/types/paper-expression';
import { arbitraryNumber } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryDataError } from '../../../types/data-error.helper';
import { arbitraryPaperExpression } from '../../../types/paper-expression.helper';
import { arbitraryColdSpringHarborArticleServer } from '../../cold-spring-harbor-article-server.helper';

const granularExpressionMatching = (expression: PaperExpression) => ({
  ...arbitraryPaperExpression(),
  expressionDoi: expression.expressionDoi,
  server: expression.server,
});

const arbitraryIrrelevantServer = (): ArticleServer => ['researchsquare' as const, 'scielopreprints' as const][arbitraryNumber(0, 1)];

const arbitraryExpressionFromIrrelevantServer = () => ({
  ...arbitraryPaperExpression(),
  server: O.some(arbitraryIrrelevantServer()),
});

describe('expand-monolithic-biorxiv-or-medrxiv-expressions', () => {
  const monolithicExpression: PaperExpression = {
    ...arbitraryPaperExpression(),
    server: O.some(arbitraryColdSpringHarborArticleServer()),
  };

  let expressions: ReadonlyArray<PaperExpression>;

  describe('given no expressions', () => {
    beforeEach(async () => {
      expressions = await pipe(
        [],
        expandPaperExpressions(shouldNotBeCalled),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('makes no changes', () => {
      expect(expressions).toHaveLength(0);
    });
  });

  describe('given one expression from an irrelevant server', () => {
    const inputExpressions = [arbitraryExpressionFromIrrelevantServer()];

    beforeEach(async () => {
      expressions = await pipe(
        inputExpressions,
        expandPaperExpressions(shouldNotBeCalled),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('makes no changes', () => {
      expect(expressions).toStrictEqual(inputExpressions);
    });
  });

  describe('given multiple expressions that are from an irrelevant server', () => {
    const inputExpressions = [
      arbitraryExpressionFromIrrelevantServer(),
      arbitraryExpressionFromIrrelevantServer(),
    ];

    beforeEach(async () => {
      expressions = await pipe(
        inputExpressions,
        expandPaperExpressions(shouldNotBeCalled),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('makes no changes', () => {
      expect(expressions).toStrictEqual(inputExpressions);
    });
  });

  describe('given a monolithic expression from a relevant server', () => {
    const getExpressionsFromBiorxiv: GetExpressionsFromBiorxiv = () => TE.right([
      granularExpressionMatching(monolithicExpression),
      granularExpressionMatching(monolithicExpression),
      granularExpressionMatching(monolithicExpression),
    ]);

    beforeEach(async () => {
      expressions = await pipe(
        [monolithicExpression],
        expandPaperExpressions(getExpressionsFromBiorxiv),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('replaces it with the granular expressions', () => {
      expect(expressions).toHaveLength(3);
    });
  });

  describe('given two monolithic expressions from a relevant server', () => {
    const monolithicExpression1: PaperExpression = {
      ...arbitraryPaperExpression(),
      server: O.some(arbitraryColdSpringHarborArticleServer()),
    };
    const monolithicExpression2: PaperExpression = {
      ...arbitraryPaperExpression(),
      server: O.some(arbitraryColdSpringHarborArticleServer()),
    };
    const getExpressionsFromBiorxiv: GetExpressionsFromBiorxiv = (expressionDoi) => {
      if (expressionDoi === monolithicExpression1.expressionDoi) {
        return TE.right([
          granularExpressionMatching(monolithicExpression1),
          granularExpressionMatching(monolithicExpression1),
          granularExpressionMatching(monolithicExpression1),
        ]);
      }
      if (expressionDoi === monolithicExpression2.expressionDoi) {
        return TE.right([
          granularExpressionMatching(monolithicExpression2),
          granularExpressionMatching(monolithicExpression2),
        ]);
      }
      return TE.left(arbitraryDataError());
    };

    beforeEach(async () => {
      expressions = await pipe(
        [monolithicExpression1, monolithicExpression2],
        expandPaperExpressions(getExpressionsFromBiorxiv),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('replaces it with the granular expressions', () => {
      expect(expressions).toHaveLength(5);
    });
  });

  describe('given a monolithic expression from a relevant server as well as multiple expressions from irrelevant servers', () => {
    const expressionsFromIrrelevantServer = [
      arbitraryExpressionFromIrrelevantServer(),
      arbitraryExpressionFromIrrelevantServer(),
    ];
    const granularExpressions = [
      granularExpressionMatching(monolithicExpression),
      granularExpressionMatching(monolithicExpression),
    ];
    const getExpressionsFromBiorxiv: GetExpressionsFromBiorxiv = () => TE.right(granularExpressions);

    beforeEach(async () => {
      expressions = await pipe(
        [
          monolithicExpression,
          ...expressionsFromIrrelevantServer,
        ],
        expandPaperExpressions(getExpressionsFromBiorxiv),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('replaces only the monolithic expression with the granular expressions', () => {
      expect(expressions).not.toContain(monolithicExpression);
      expect(expressions).toStrictEqual(expect.arrayContaining(
        [
          ...expressionsFromIrrelevantServer,
          ...granularExpressions,
        ],
      ));
    });
  });
});
