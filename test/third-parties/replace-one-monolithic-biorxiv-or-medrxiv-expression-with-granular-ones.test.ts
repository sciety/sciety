import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import {
  GetExpressionsFromBiorxiv,
  replaceOneMonolithicBiorxivOrMedrxivExpressionWithGranularOnes,
} from '../../src/third-parties/replace-one-monolithic-biorxiv-or-medrxiv-expression-with-granular-ones';
import { shouldNotBeCalled } from '../should-not-be-called';
import { PaperExpression } from '../../src/types/paper-expression';
import { arbitraryPaperExpression } from '../types/paper-expression.helper';
import { arbitraryExpressionDoi } from '../types/expression-doi.helper';

const granularExpressionMatching = (expression: PaperExpression) => ({
  ...arbitraryPaperExpression(),
  expressionDoi: expression.expressionDoi,
  server: expression.server,
});

const arbitraryIrrelevantServer = () => 'researchsquare' as const;

const arbitraryExpressionFromIrrelevantServer = () => ({
  ...arbitraryPaperExpression(),
  server: O.some(arbitraryIrrelevantServer()),
});

describe('replace-one-monolithic-biorxiv-or-medrxiv-expression-with-granular-ones', () => {
  const relevantServer = 'biorxiv' as const;
  const monolithicExpression: PaperExpression = {
    ...arbitraryPaperExpression(),
    server: O.some(relevantServer),
  };

  let expressions: ReadonlyArray<PaperExpression>;

  describe.skip('given no expressions', () => {
    beforeEach(async () => {
      expressions = await pipe(
        [],
        replaceOneMonolithicBiorxivOrMedrxivExpressionWithGranularOnes(
          shouldNotBeCalled,
          arbitraryExpressionDoi(),
        ),
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
        replaceOneMonolithicBiorxivOrMedrxivExpressionWithGranularOnes(
          shouldNotBeCalled,
          inputExpressions[0].expressionDoi,
        ),
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
        replaceOneMonolithicBiorxivOrMedrxivExpressionWithGranularOnes(
          shouldNotBeCalled,
          inputExpressions[0].expressionDoi,
        ),
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
        replaceOneMonolithicBiorxivOrMedrxivExpressionWithGranularOnes(
          getExpressionsFromBiorxiv,
          monolithicExpression.expressionDoi,
        ),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('replaces it with the granular expressions', () => {
      expect(expressions).toHaveLength(3);
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
        replaceOneMonolithicBiorxivOrMedrxivExpressionWithGranularOnes(
          getExpressionsFromBiorxiv,
          monolithicExpression.expressionDoi,
        ),
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
