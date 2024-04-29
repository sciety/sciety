import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { fetchPrereviewEvaluations } from '../../src/ingest/evaluation-fetchers/fetch-prereview-evaluations';
import { DiscoveredPublishedEvaluations } from '../../src/ingest/types/discovered-published-evaluations';
import { constructPublishedEvaluation } from '../../src/ingest/types/published-evaluation';
import * as AID from '../../src/types/article-id';
import { arbitraryDate, arbitraryWord } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryArticleId } from '../types/article-id.helper';

describe('fetch-prereview-evaluations', () => {
  describe('when the reponse includes no preprints', () => {
    let result: DiscoveredPublishedEvaluations;

    beforeEach(async () => {
      result = await pipe(
        {
          fetchData: <D>() => TE.right({ data: [] } as unknown as D),
        },
        fetchPrereviewEvaluations(),
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
        handle: articleId.value,
        fullReviews: [
          {
            createdAt: date1.toString(), doi: reviewDoi1.value, isPublished: true, authors: [],
          },
          {
            createdAt: date2.toString(), doi: reviewDoi2.value, isPublished: true, authors: [],
          },
        ],
      },
    ];
    let result: DiscoveredPublishedEvaluations;

    beforeEach(async () => {
      result = await pipe(
        {
          fetchData: <D>() => TE.right({ data: response } as unknown as D),
        },
        fetchPrereviewEvaluations(),
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

  describe('when the response includes a biorxiv preprint with a review that lacks a DOI', () => {
    const articleId = arbitraryArticleId();
    const date1 = arbitraryDate();
    const date2 = arbitraryDate();
    const reviewDoi1 = arbitraryArticleId();
    const response = [
      {
        handle: articleId.value,
        fullReviews: [
          {
            createdAt: date1.toString(), doi: reviewDoi1.value, isPublished: true, authors: [],
          },
          { createdAt: date2.toString(), isPublished: true, authors: [] },
        ],
      },
    ];
    let result: DiscoveredPublishedEvaluations;

    beforeEach(async () => {
      result = await pipe(
        {
          fetchData: <D>() => TE.right({ data: response } as unknown as D),
        },
        fetchPrereviewEvaluations(),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns the valid review', async () => {
      const expectedEvaluation = constructPublishedEvaluation({
        paperExpressionDoi: articleId.value,
        publishedOn: date1,
        evaluationLocator: `doi:${reviewDoi1.value}`,
      });

      expect(result.understood).toStrictEqual([
        expectedEvaluation,
      ]);
    });

    it('returns one skipped item for the DOI-less review', async () => {
      expect(result.skipped[0].reason).toBe('review has no DOI');
    });
  });

  describe('when the response includes an unpublished review', () => {
    const articleId = arbitraryArticleId('10.1234');
    const response = [
      {
        handle: articleId.value,
        fullReviews: [
          {
            createdAt: arbitraryDate().toString(), doi: `10.1234/${arbitraryWord()}`, isPublished: false, authors: [],
          },
        ],
      },
    ];
    let result: DiscoveredPublishedEvaluations;

    beforeEach(async () => {
      result = await pipe(
        {
          fetchData: <D>() => TE.right({ data: response } as unknown as D),
        },
        fetchPrereviewEvaluations(),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns a skipped item', async () => {
      expect(result.skipped).toStrictEqual([
        {
          item: AID.toString(articleId),
          reason: 'is not published',
        },
      ]);
    });
  });

  describe('when the response is corrupt', () => {
    let result: E.Either<unknown, unknown>;

    beforeEach(async () => {
      result = await pipe(
        {
          fetchData: <D>() => TE.right({} as unknown as D),
        },
        fetchPrereviewEvaluations(),
      )();
    });

    it('reports an error', async () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });
});
