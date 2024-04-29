import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { fetchPrereviewEvaluations } from '../../src/ingest/evaluation-fetchers/fetch-prereview-evaluations';
import { FeedData } from '../../src/ingest/types/feed-data';
import * as AID from '../../src/types/article-id';
import { arbitraryDate, arbitraryWord } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryArticleId } from '../types/article-id.helper';

describe('fetch-prereview-evaluations', () => {
  describe('when the reponse includes no preprints', () => {
    let result: FeedData;

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
      expect(result.evaluations).toHaveLength(0);
    });

    it('returns no skipped items', async () => {
      expect(result.skippedItems).toHaveLength(0);
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
    let result: FeedData;

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
      expect(result.evaluations).toStrictEqual([
        {
          articleDoi: articleId.value,
          publishedOn: date1,
          evaluationLocator: `doi:${reviewDoi1.value}`,
          authors: [],
        },
        {
          articleDoi: articleId.value,
          publishedOn: date2,
          evaluationLocator: `doi:${reviewDoi2.value}`,
          authors: [],
        },
      ]);
    });

    it('returns no skipped items', async () => {
      expect(result.skippedItems).toHaveLength(0);
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
    let result: FeedData;

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
      expect(result.evaluations).toStrictEqual([
        {
          articleDoi: articleId.value,
          publishedOn: date1,
          evaluationLocator: `doi:${reviewDoi1.value}`,
          authors: [],
        },
      ]);
    });

    it('returns one skipped item for the DOI-less review', async () => {
      expect(result.skippedItems[0].reason).toBe('review has no DOI');
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
    let result: FeedData;

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
      expect(result.skippedItems).toStrictEqual([
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
