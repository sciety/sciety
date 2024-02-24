import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { fetchPrereviewEvaluations } from '../../src/ingest/fetch-prereview-evaluations.js';
import { arbitraryDate, arbitraryWord } from '../helpers.js';
import { shouldNotBeCalled } from '../should-not-be-called.js';
import { arbitraryArticleId } from '../types/article-id.helper.js';
import * as AID from '../../src/types/article-id.js';

describe('fetch-prereview-evaluations', () => {
  describe('when the reponse includes no preprints', () => {
    const result = fetchPrereviewEvaluations()({
      fetchData: <D>() => TE.right({ data: [] } as unknown as D),
      fetchGoogleSheet: shouldNotBeCalled,
    });

    it('returns no evaluations', async () => {
      expect(await result()).toStrictEqual(E.right(expect.objectContaining({
        evaluations: [],
      })));
    });

    it('returns no skipped items', async () => {
      expect(await result()).toStrictEqual(E.right(expect.objectContaining({
        skippedItems: [],
      })));
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
    const result = fetchPrereviewEvaluations()({
      fetchData: <D>() => TE.right({ data: response } as unknown as D),
      fetchGoogleSheet: shouldNotBeCalled,
    });

    it('returns the reviews', async () => {
      expect(await result()).toStrictEqual(E.right(expect.objectContaining({
        evaluations: [
          {
            articleDoi: articleId.value,
            date: date1,
            evaluationLocator: `doi:${reviewDoi1.value}`,
            authors: [],
          },
          {
            articleDoi: articleId.value,
            date: date2,
            evaluationLocator: `doi:${reviewDoi2.value}`,
            authors: [],
          },
        ],
      })));
    });

    it('returns no skipped items', async () => {
      expect(await result()).toStrictEqual(E.right(expect.objectContaining({
        skippedItems: [],
      })));
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
    const result = fetchPrereviewEvaluations()({
      fetchData: <D>() => TE.right({ data: response } as unknown as D),
      fetchGoogleSheet: shouldNotBeCalled,
    });

    it('returns the valid review', async () => {
      expect(await result()).toStrictEqual(E.right(expect.objectContaining({
        evaluations: [
          {
            articleDoi: articleId.value,
            date: date1,
            evaluationLocator: `doi:${reviewDoi1.value}`,
            authors: [],
          },
        ],
      })));
    });

    it('returns one skipped item for the DOI-less review', async () => {
      expect(await result()).toStrictEqual(E.right(expect.objectContaining({
        skippedItems: [
          expect.objectContaining({
            reason: 'review has no DOI',
          }),
        ],
      })));
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
    const result = fetchPrereviewEvaluations()({
      fetchData: <D>() => TE.right({ data: response } as unknown as D),
      fetchGoogleSheet: shouldNotBeCalled,
    });

    it('returns a skipped item', async () => {
      expect(await result()).toStrictEqual(E.right(expect.objectContaining({
        skippedItems: [
          {
            item: AID.toString(articleId),
            reason: 'is not published',
          },
        ],
      })));
    });
  });

  describe('when the response is corrupt', () => {
    it('reports an error', async () => {
      const result = fetchPrereviewEvaluations()({
        fetchData: <D>() => TE.right({} as unknown as D),
        fetchGoogleSheet: shouldNotBeCalled,
      });

      expect(await result()).toStrictEqual(E.left(expect.stringContaining('Invalid value')));
    });
  });
});
