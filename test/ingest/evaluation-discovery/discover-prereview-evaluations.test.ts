import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { arbitraryIngestDays } from './ingest-days.helper';
import { discoverPrereviewEvaluations } from '../../../src/ingest/evaluation-discovery/discover-prereview-evaluations';
import { DiscoveredPublishedEvaluations } from '../../../src/ingest/types/discovered-published-evaluations';
import { constructPublishedEvaluation } from '../../../src/ingest/types/published-evaluation';
import { arbitraryDate } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryArticleId } from '../../types/article-id.helper';

const runDiscovery = (stubbedResponse: unknown) => pipe(
  ({ fetchData: <D>() => TE.right(stubbedResponse as unknown as D) }),
  discoverPrereviewEvaluations()(arbitraryIngestDays()),
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
    const articleId = arbitraryArticleId();
    const date1 = arbitraryDate();
    const date2 = arbitraryDate();
    const reviewDoi1 = arbitraryArticleId();
    const reviewDoi2 = arbitraryArticleId();
    const response = [
      {
        preprint: articleId.value,
        createdAt: date1.toString(),
        doi: reviewDoi1.value,
        authors: [],
      },
      {
        preprint: articleId.value,
        createdAt: date2.toString(),
        doi: reviewDoi2.value,
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
        paperExpressionDoi: articleId.value,
        publishedOn: date1,
        evaluationLocator: `doi:${reviewDoi1.value}`,
      });
      const expectedEvaluation2 = constructPublishedEvaluation({
        paperExpressionDoi: articleId.value,
        publishedOn: date2,
        evaluationLocator: `doi:${reviewDoi2.value}`,
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

  describe('when the response includes a preprint that lacks a DOI', () => {
    const date1 = arbitraryDate();
    const reviewDoi1 = arbitraryArticleId();
    const response = [
      {
        preprint: 'evaluated preprint does not have a DOI',
        createdAt: date1.toString(),
        doi: reviewDoi1.value,
        authors: [],
      },
    ];

    beforeEach(async () => {
      result = await pipe(
        runDiscovery(response),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns one skipped item', () => {
      expect(result.skipped[0].reason).toBe('evaluated preprint does not have a DOI');
    });
  });
});
