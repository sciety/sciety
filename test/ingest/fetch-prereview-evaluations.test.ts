import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { fetchPrereviewEvaluations } from '../../src/ingest/fetch-prereview-evaluations';
import { arbitraryDate } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryDoi } from '../types/doi.helper';

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
        skippedItems: O.some([]),
      })));
    });
  });

  describe('when the response includes a biorxiv preprint with valid reviews', () => {
    const articleId = arbitraryDoi();
    const date1 = arbitraryDate();
    const date2 = arbitraryDate();
    const reviewDoi1 = arbitraryDoi();
    const reviewDoi2 = arbitraryDoi();
    const response = [
      {
        handle: articleId.value,
        fullReviews: [
          { createdAt: date1.toString(), doi: reviewDoi1.value },
          { createdAt: date2.toString(), doi: reviewDoi2.value },
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
          },
          {
            articleDoi: articleId.value,
            date: date2,
            evaluationLocator: `doi:${reviewDoi2.value}`,
          },
        ],
      })));
    });

    it('returns no skipped items', async () => {
      expect(await result()).toStrictEqual(E.right(expect.objectContaining({
        skippedItems: O.some([]),
      })));
    });
  });

  describe('when the response includes a biorxiv preprint with a non-DOI review', () => {
    const articleId = arbitraryDoi();
    const date1 = arbitraryDate();
    const date2 = arbitraryDate();
    const reviewDoi1 = arbitraryDoi();
    const response = [
      {
        handle: articleId.value,
        fullReviews: [
          { createdAt: date1.toString(), doi: reviewDoi1.value },
          { createdAt: date2.toString() },
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
          },
        ],
      })));
    });

    it.todo('returns one skipped item for the DOI-less review');
  });

  describe('when the response includes a non-biorxiv preprint with valid reviews', () => {
    const articleId = arbitraryDoi('10.1234');
    const date1 = arbitraryDate();
    const date2 = arbitraryDate();
    const reviewDoi1 = arbitraryDoi();
    const reviewDoi2 = arbitraryDoi();
    const response = [
      {
        handle: articleId.value,
        fullReviews: [
          { createdAt: date1.toString(), doi: reviewDoi1.value },
          { createdAt: date2.toString(), doi: reviewDoi2.value },
        ],
      },
    ];
    const result = fetchPrereviewEvaluations()({
      fetchData: <D>() => TE.right({ data: response } as unknown as D),
      fetchGoogleSheet: shouldNotBeCalled,
    });

    it('returns no reviews', async () => {
      expect(await result()).toStrictEqual(E.right(expect.objectContaining({
        evaluations: [],
      })));
    });

    it.todo('returns a skipped item');
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
