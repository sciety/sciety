import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as EDOI from '../../../src/types/expression-doi';
import { arbitrarySanitisedHtmlFragment, arbitraryString } from '../../helpers';
import * as DE from '../../../src/types/data-error';
import { fetchRecommendedPapers } from '../../../src/third-parties/sciety-labs/fetch-recommended-papers';
import { dummyLogger } from '../../dummy-logger';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryPublishingHistoryOnlyPreprints } from '../../types/publishing-history.helper';
import { arbitraryPaperExpression } from '../../types/paper-expression.helper';
import * as PH from '../../../src/types/publishing-history';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';

const articleTitle = arbitrarySanitisedHtmlFragment();
const articleAuthors = [arbitraryString(), arbitraryString()];

const arbitraryRecommendedPaper = (articleId: string) => ({
  externalIds: {
    DOI: articleId,
  },
  title: articleTitle.toString(),
  authors: [
    {
      name: articleAuthors[0],
    },
    {
      name: articleAuthors[1],
    },
  ],
});

describe('fetch-recommended-papers', () => {
  describe('given a publishing history containing only preprints', () => {
    it('uses the latest preprint expression\'s doi to query the third party', async () => {
      const foo = jest.fn(() => TE.right({
        recommendedPapers: [],
      }));
      const queryExternalService = () => foo;
      const latestPreprintExpressionDoi = arbitraryExpressionDoi();
      const publishingHistory = pipe(
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
      await pipe(
        publishingHistory,
        fetchRecommendedPapers(queryExternalService, dummyLogger),
        TE.getOrElseW(shouldNotBeCalled),
      )();

      expect(foo).toHaveBeenCalledWith(expect.stringContaining(latestPreprintExpressionDoi));
    });
  });

  describe('given a publishing history whose latest expression is a journal article', () => {
    it.todo('uses the latest preprint expression\'s doi to query the third party');
  });

  describe.each([
    ['biorxiv or medrxiv', '10.1101/2023.01.15.524119'],
    ['biorxiv or medrxiv', '10.1101/452326'],
    ['research square', '10.21203/rs.3.rs-2200020/v3'],
    ['scielo preprints', '10.1590/SciELOPreprints.3429'],
    // ['osf', '10.31234/osf.io/td68z'],
  ])('when a response contains a supported article (%s %s)', (_, supportedArticleId) => {
    it('translates to RelatedArticles type', async () => {
      const queryExternalService = () => () => TE.right({
        recommendedPapers: [
          arbitraryRecommendedPaper(supportedArticleId),
        ],
      });
      const result = await pipe(
        arbitraryPublishingHistoryOnlyPreprints(),
        fetchRecommendedPapers(queryExternalService, dummyLogger),
        TE.getOrElseW(shouldNotBeCalled),
      )();
      const expected: ReadonlyArray<EDOI.ExpressionDoi> = [EDOI.fromValidatedString(supportedArticleId)];

      expect(result).toStrictEqual(expected);
    });
  });

  describe('when a response contains an corrupt DOI', () => {
    const corruptDoi = '10.1101/2023.01.15.524119 10.1101/123456';
    const supportedBiorxivArticleId = '10.1101/123';

    it('removes the unsupported article', async () => {
      const queryExternalService = () => () => TE.right({
        recommendedPapers: [
          arbitraryRecommendedPaper(supportedBiorxivArticleId),
          arbitraryRecommendedPaper(corruptDoi),
        ],
      });
      const result = await pipe(
        arbitraryPublishingHistoryOnlyPreprints(),
        fetchRecommendedPapers(queryExternalService, dummyLogger),
        TE.getOrElseW(shouldNotBeCalled),
      )();
      const expected: ReadonlyArray<EDOI.ExpressionDoi> = [EDOI.fromValidatedString(supportedBiorxivArticleId)];

      expect(result).toStrictEqual(expected);
    });
  });

  describe.each([
    ['10.26434/not-a-supported-doi'],
    ['10.1590/2176-9451.19.4.027-029.ebo'],
    ['10.1101/cshperspect.a041248'],
    ['10.1101/gad.314351.118'],
    ['10.1101/gr.277335.122'],
    ['10.1101/lm.045724.117'],
  ])('when a response contains an unsupported article (%s)', (unsupportedArticleId) => {
    const supportedBiorxivArticleId = '10.1101/123';

    it('removes the unsupported article', async () => {
      const queryExternalService = () => () => TE.right({
        recommendedPapers: [
          arbitraryRecommendedPaper(supportedBiorxivArticleId),
          arbitraryRecommendedPaper(unsupportedArticleId),
        ],
      });
      const result = await pipe(
        arbitraryPublishingHistoryOnlyPreprints(),
        fetchRecommendedPapers(queryExternalService, dummyLogger),
        TE.getOrElseW(shouldNotBeCalled),
      )();
      const expected: ReadonlyArray<EDOI.ExpressionDoi> = [EDOI.fromValidatedString(supportedBiorxivArticleId)];

      expect(result).toStrictEqual(expected);
    });
  });

  describe('when we cannot access the third-party', () => {
    it('returns a left', async () => {
      const queryExternalService = () => () => TE.left(DE.unavailable);
      const result = await pipe(
        arbitraryPublishingHistoryOnlyPreprints(),
        fetchRecommendedPapers(queryExternalService, dummyLogger),
      )();

      expect(E.isLeft(result)).toBe(true);
    });
  });

  describe('when we cannot decode the response', () => {
    it('returns a left', async () => {
      const queryExternalService = () => () => TE.right(arbitraryString());
      const result = await pipe(
        arbitraryPublishingHistoryOnlyPreprints(),
        fetchRecommendedPapers(queryExternalService, dummyLogger),
      )();

      expect(E.isLeft(result)).toBe(true);
    });
  });

  describe('when the response contains an article with no DOI', () => {
    const response = {
      recommendedPapers: [
        {
          externalIds: {},
          title: articleTitle.toString(),
          authors: [
            {
              name: articleAuthors[0],
            },
            {
              name: articleAuthors[1],
            },
          ],
        },
      ],
    };
    const queryExternalService = () => () => TE.right(response);

    it('ignores such articles', async () => {
      const result = await pipe(
        arbitraryPublishingHistoryOnlyPreprints(),
        fetchRecommendedPapers(queryExternalService, dummyLogger),
        TE.getOrElseW(shouldNotBeCalled),
      )();

      expect(result).toStrictEqual([]);
    });
  });
});
