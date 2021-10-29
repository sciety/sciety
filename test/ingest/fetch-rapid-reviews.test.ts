import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { fetchRapidReviews } from '../../src/ingest/fetch-rapid-reviews';
import { FeedData } from '../../src/ingest/update-all';
import { arbitraryDate, arbitraryUri, arbitraryWord } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryDoi } from '../types/doi.helper';

const ingest = (items: ReadonlyArray<unknown>) => {
  const fetchData = jest.fn()
    .mockReturnValueOnce(TE.right({
      message: {
        'total-results': items.length,
      },
    }))
    .mockReturnValueOnce(TE.right({
      message: { items },
    }));
  return pipe(
    {
      fetchData,
      fetchGoogleSheet: shouldNotBeCalled,
    },
    fetchRapidReviews(),
  );
};

describe('fetch-rapid-reviews', () => {
  describe('when there are no Crossref reviews', () => {
    it('returns no evaluations and no skipped items', async () => {
      expect(await ingest([])()).toStrictEqual(E.right({
        evaluations: [],
        skippedItems: [],
      }));
    });
  });

  describe('when there is a valid Crossref review', () => {
    it('returns 1 evaluation and no skipped items', async () => {
      const articleDoi = arbitraryDoi().value;
      const date = arbitraryDate();
      const reviewUrl = arbitraryUri();
      const items = [
        {
          URL: reviewUrl,
          created: { 'date-time': date.toString() },
          relation: { 'is-review-of': [{ id: articleDoi }] },
        },
      ];

      expect(await ingest(items)()).toStrictEqual(E.right({
        evaluations: [
          {
            articleDoi,
            date,
            evaluationLocator: `rapidreviews:${reviewUrl}`,
            authors: [],
          },
        ],
        skippedItems: [],
      }));
    });
  });

  describe('when there is a Crossref review for a article that is not on bioRxiv nor medRxiv', () => {
    it('returns 0 evaluations and 1 skipped item', async () => {
      const articleDoi = '10.26434/chemrxiv.12770225.v1';
      const date = arbitraryDate();
      const reviewUrl = arbitraryUri();
      const items = [
        {
          URL: reviewUrl,
          created: { 'date-time': date.toString() },
          relation: { 'is-review-of': [{ id: articleDoi }] },
        },
      ];

      expect(await ingest(items)()).toStrictEqual(E.right({
        evaluations: [],
        skippedItems: [
          {
            item: articleDoi,
            reason: 'Not a biorxiv article',
          },
        ],
      }));
    });
  });

  describe('when there is an Crossref review with no author field', () => {
    const items = [
      {
        URL: arbitraryUri(),
        created: { 'date-time': arbitraryDate().toString() },
        relation: { 'is-review-of': [{ id: arbitraryDoi().value }] },
      },
    ];

    let result: FeedData;

    beforeEach(async () => {
      result = await pipe(
        items,
        ingest,
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns an evaluation with an empty array of authors', () => {
      expect(result.evaluations[0].authors).toStrictEqual([]);
    });
  });

  describe('when there is an Crossref review with an empty array for the author field', () => {
    const items = [
      {
        URL: arbitraryUri(),
        created: { 'date-time': arbitraryDate().toString() },
        relation: { 'is-review-of': [{ id: arbitraryDoi().value }] },
        author: [],
      },
    ];

    let result: FeedData;

    beforeEach(async () => {
      result = await pipe(
        items,
        ingest,
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns an evaluation with an empty array of authors', () => {
      expect(result.evaluations[0].authors).toStrictEqual([]);
    });
  });

  describe('when there is an Crossref review from an author with only a family name', () => {
    const familyName = arbitraryWord();
    const items = [
      {
        URL: arbitraryUri(),
        created: { 'date-time': arbitraryDate().toString() },
        relation: { 'is-review-of': [{ id: arbitraryDoi().value }] },
        author: [{ family: familyName }],
      },
    ];

    let result: FeedData;

    beforeEach(async () => {
      result = await pipe(
        items,
        ingest,
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns the evaluation including an author with that family name', () => {
      expect(result.evaluations[0].authors).toStrictEqual([
        familyName,
      ]);
    });
  });

  describe('when there is an Crossref review from an author with both a given name and a family name', () => {
    it.todo('returns the evaluation including an author with both those names');
  });
});
