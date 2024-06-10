import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { arbitraryIngestDays } from './ingest-days.helper';
import { discoverPrereviewEvaluations } from '../../src/evaluation-discovery/discover-prereview-evaluations';
import { DiscoveredPublishedEvaluations } from '../../src/types/discovered-published-evaluations';
import { constructPublishedEvaluation } from '../../src/types/published-evaluation';
import { arbitraryArticleId } from '../article-id.helper';
import { arbitraryDate, arbitraryString, arbitraryWord } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';

const runDiscovery = (stubbedResponse: unknown) => pipe(
  ({ fetchData: <D>() => TE.right(stubbedResponse as unknown as D) }),
  discoverPrereviewEvaluations(arbitraryString())(arbitraryIngestDays()),
);

describe('discover-prereview-evaluations', () => {
  let result: DiscoveredPublishedEvaluations;

  describe('when the response includes no preprints', () => {
    beforeEach(async () => {
      result = await pipe(
        runDiscovery([]),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns no evaluations', async () => {
      expect(result.understood).toHaveLength(0);
    });

    it('returns no skipped items', async () => {
      expect(result.skipped).toHaveLength(0);
    });
  });

  describe('when the response includes a biorxiv preprint with valid reviews', () => {
    const preprintDoi = arbitraryWord();
    const date1 = arbitraryDate();
    const date2 = arbitraryDate();
    const reviewDoi1 = arbitraryArticleId();
    const reviewDoi2 = arbitraryArticleId();
    const response = [
      {
        preprint: `doi:${preprintDoi}`,
        createdAt: date1.toString(),
        doi: reviewDoi1,
        authors: [],
      },
      {
        preprint: `doi:${preprintDoi}`,
        createdAt: date2.toString(),
        doi: reviewDoi2,
        authors: [],
      },
    ];

    beforeEach(async () => {
      result = await pipe(
        runDiscovery(response),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns the reviews', async () => {
      const expectedEvaluation1 = constructPublishedEvaluation({
        paperExpressionDoi: preprintDoi,
        publishedOn: date1,
        evaluationLocator: `doi:${reviewDoi1}`,
      });
      const expectedEvaluation2 = constructPublishedEvaluation({
        paperExpressionDoi: preprintDoi,
        publishedOn: date2,
        evaluationLocator: `doi:${reviewDoi2}`,
      });

      expect(result.understood).toStrictEqual([
        expectedEvaluation1,
        expectedEvaluation2,
      ]);
    });

    it('returns no skipped items', async () => {
      expect(result.skipped).toHaveLength(0);
    });
  });

  describe('when the response includes a review with authors', () => {
    const authorName1 = arbitraryString();
    const authorName2 = arbitraryString();
    const response = [
      {
        preprint: `doi:${arbitraryWord()}`,
        createdAt: arbitraryDate().toString(),
        doi: arbitraryArticleId(),
        authors: [
          {
            name: authorName1,
          },
          {
            name: authorName2,
          },
        ],
      },
    ];

    beforeEach(async () => {
      result = await pipe(
        runDiscovery(response),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns the reviews', async () => {
      expect(result.understood[0].authors).toStrictEqual([
        authorName1, authorName2,
      ]);
    });

    it('returns no skipped items', async () => {
      expect(result.skipped).toHaveLength(0);
    });
  });
});
