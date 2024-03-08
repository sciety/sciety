import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as EDOI from '../../../src/types/expression-doi';
import { arbitraryString } from '../../helpers';
import * as DE from '../../../src/types/data-error';
import { createFetchRecommendedPapers } from '../../../src/third-parties/fetch-recommended-papers/create-fetch-recommended-papers';
import { dummyLogger } from '../../dummy-logger';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryPublishingHistoryOnlyPreprints } from '../../types/publishing-history.helper';
import { arbitraryPaperExpression } from '../../types/paper-expression.helper';
import * as PH from '../../../src/types/publishing-history';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import { QueryExternalService } from '../../../src/third-parties/query-external-service';
import { ExpressionDoi } from '../../../src/types/expression-doi';
import { PublishingHistory } from '../../../src/types/publishing-history';

const arbitraryRecommendedPaper = (articleId: string) => ({
  externalIds: {
    DOI: articleId,
  },
});

const historyWithPreprintAsLatestExpression = (latestPreprintExpressionDoi: EDOI.ExpressionDoi) => pipe(
  [
    {
      ...arbitraryPaperExpression(),
      expressionType: 'preprint',
      publishedAt: new Date('2000-01-01'),
    },
    {
      ...arbitraryPaperExpression(),
      expressionDoi: latestPreprintExpressionDoi,
      expressionType: 'preprint',
      publishedAt: new Date('2020-01-01'),
    },
  ],
  PH.fromExpressions,
  E.getOrElseW(shouldNotBeCalled),
);

const historyWithJournalArticleAsLatestExpression = (latestPreprintExpressionDoi: EDOI.ExpressionDoi) => pipe(
  [
    {
      ...arbitraryPaperExpression(),
      expressionType: 'preprint',
      publishedAt: new Date('2000-01-01'),
    },
    {
      ...arbitraryPaperExpression(),
      expressionDoi: latestPreprintExpressionDoi,
      expressionType: 'preprint',
      publishedAt: new Date('2020-01-01'),
    },
    {
      ...arbitraryPaperExpression(),
      expressionType: 'journal-article',
      publishedAt: new Date('2030-01-01'),
    },
  ],
  PH.fromExpressions,
  E.getOrElseW(shouldNotBeCalled),
);

describe('create-fetch-recommended-papers', () => {
  describe('given a specific publishing history', () => {
    const latestPreprintExpressionDoi = arbitraryExpressionDoi();
    let spy: ReturnType<QueryExternalService>;
    let queryExternalService: QueryExternalService;
    const invokeExternalService = async (publishingHistory: PublishingHistory) => pipe(
      publishingHistory,
      createFetchRecommendedPapers(queryExternalService, dummyLogger),
      TE.getOrElseW(shouldNotBeCalled),
    )();

    beforeEach(() => {
      spy = jest.fn(() => TE.right({ recommendedPapers: [] }));
      queryExternalService = () => spy;
    });

    describe('whose latest expression is a preprint', () => {
      const publishingHistory = historyWithPreprintAsLatestExpression(latestPreprintExpressionDoi);

      beforeEach(async () => {
        await invokeExternalService(publishingHistory);
      });

      it('uses the latest preprint expression\'s doi to query the third party', async () => {
        expect(spy).toHaveBeenCalledWith(expect.stringContaining(latestPreprintExpressionDoi));
      });
    });

    describe('whose latest expression is a journal article', () => {
      const publishingHistory = historyWithJournalArticleAsLatestExpression(latestPreprintExpressionDoi);

      beforeEach(async () => {
        await invokeExternalService(publishingHistory);
      });

      it('uses the latest preprint expression\'s doi to query the third party', () => {
        expect(spy).toHaveBeenCalledWith(expect.stringContaining(latestPreprintExpressionDoi));
      });
    });
  });

  describe('given an arbitrary publishing history', () => {
    const getRecommendedPapers = (queryExternalService: QueryExternalService) => pipe(
      arbitraryPublishingHistoryOnlyPreprints(),
      createFetchRecommendedPapers(queryExternalService, dummyLogger),
    );

    describe('when a response contains an understandable DOI', () => {
      const recommendedExpressionDoi = arbitraryExpressionDoi();
      const queryExternalService = () => () => TE.right({
        recommendedPapers: [
          arbitraryRecommendedPaper(recommendedExpressionDoi),
        ],
      });
      let recommendedPapers: ReadonlyArray<ExpressionDoi>;

      beforeEach(async () => {
        recommendedPapers = await pipe(
          getRecommendedPapers(queryExternalService),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('returns an array containing an expression DOI', () => {
        expect(recommendedPapers).toStrictEqual([recommendedExpressionDoi]);
      });
    });

    describe('when a response contains an corrupt DOI', () => {
      const corruptDoi = '10.1101/2023.01.15.524119 10.1101/123456';
      const understandableDoi = '10.1101/123';
      const queryExternalService = () => () => TE.right({
        recommendedPapers: [
          arbitraryRecommendedPaper(understandableDoi),
          arbitraryRecommendedPaper(corruptDoi),
        ],
      });

      let result: ReadonlyArray<ExpressionDoi>;

      beforeEach(async () => {
        result = await pipe(
          getRecommendedPapers(queryExternalService),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('returns an array that does not include the corrupted DOI', () => {
        expect(result).toStrictEqual([EDOI.fromValidatedString(understandableDoi)]);
      });
    });

    describe('when we cannot access the third-party', () => {
      const queryExternalService = () => () => TE.left(DE.unavailable);
      let result: E.Either<unknown, unknown>;

      beforeEach(async () => {
        result = await getRecommendedPapers(queryExternalService)();
      });

      it('returns a left', () => {
        expect(E.isLeft(result)).toBe(true);
      });
    });

    describe('when we cannot decode the response', () => {
      const queryExternalService = () => () => TE.right(arbitraryString());
      let result: E.Either<unknown, unknown>;

      beforeEach(async () => {
        result = await getRecommendedPapers(queryExternalService)();
      });

      it('returns a left', () => {
        expect(E.isLeft(result)).toBe(true);
      });
    });

    describe('when the response contains a paper with no DOI', () => {
      const response = {
        recommendedPapers: [
          {
            externalIds: {},
          },
        ],
      };
      const queryExternalService = () => () => TE.right(response);
      let result: ReadonlyArray<ExpressionDoi>;

      beforeEach(async () => {
        result = await pipe(
          getRecommendedPapers(queryExternalService),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('ignores such papers', () => {
        expect(result).toStrictEqual([]);
      });
    });
  });
});
