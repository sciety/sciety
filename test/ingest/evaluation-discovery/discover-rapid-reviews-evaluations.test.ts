import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { arbitraryIngestDays } from './ingest-days.helper';
import { discoverRapidReviewsEvaluations } from '../../../src/ingest/evaluation-discovery/discover-rapid-reviews-evaluations';
import { DiscoveredPublishedEvaluations } from '../../../src/ingest/types/discovered-published-evaluations';
import { constructPublishedEvaluation } from '../../../src/ingest/types/published-evaluation';
import { arbitraryDate, arbitraryUri, arbitraryWord } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';

const ingest = (crossrefResponseItems: ReadonlyArray<unknown>) => pipe(
  {
    fetchData: <D>() => TE.right({ message: { items: crossrefResponseItems } } as unknown as D),
    fetchGoogleSheet: shouldNotBeCalled,
  },
  discoverRapidReviewsEvaluations()(arbitraryIngestDays()),
);

describe('discover-rapid-reviews-evaluations', () => {
  const arbitraryPrimaryUrl = `https://rrid.${arbitraryWord()}`;

  describe('when there are no Crossref reviews', () => {
    it('returns no evaluations and no skipped items', async () => {
      expect(await ingest([])()).toStrictEqual(E.right({
        understood: [],
        skipped: [],
      }));
    });
  });

  describe('when there is a valid Crossref review', () => {
    it('returns 1 evaluation and no skipped items', async () => {
      const articleDoi = arbitraryExpressionDoi();
      const date = arbitraryDate();
      const reviewUrl = arbitraryUri();
      const items = [
        {
          URL: reviewUrl,
          created: { 'date-time': date.toString() },
          relation: { 'is-review-of': [{ id: articleDoi }] },
          resource: {
            primary: {
              URL: arbitraryPrimaryUrl,
            },
          },
        },
      ];
      const expectedEvaluation = constructPublishedEvaluation({
        paperExpressionDoi: articleDoi,
        publishedOn: date,
        evaluationLocator: `rapidreviews:${reviewUrl}`,
      });

      expect(await ingest(items)()).toStrictEqual(E.right({
        understood: [
          expectedEvaluation,
        ],
        skipped: [],
      }));
    });
  });

  describe('when there is a valid Crossref review that is not by Rapid Reviews Infectious Diseases', () => {
    const articleDoi = arbitraryExpressionDoi();
    const date = arbitraryDate();
    const reviewUrl = arbitraryUri();
    let result: DiscoveredPublishedEvaluations;

    beforeEach(async () => {
      result = await pipe(
        [
          {
            URL: reviewUrl,
            created: { 'date-time': date.toString() },
            relation: { 'is-review-of': [{ id: articleDoi }] },
            resource: {
              primary: {
                URL: arbitraryUri(),
              },
            },
          },
        ],
        ingest,
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns no evaluations', () => {
      expect(result.understood).toHaveLength(0);
    });

    it('returns a skipped item', async () => {
      expect(result.skipped[0].item).toStrictEqual(reviewUrl);
    });
  });

  describe('when there is a valid Crossref review with multiple authors', () => {
    const items = [
      {
        URL: arbitraryUri(),
        created: { 'date-time': arbitraryDate().toString() },
        relation: { 'is-review-of': [{ id: arbitraryExpressionDoi() }] },
        author: [
          { given: 'Fred', family: 'Blogs' },
          { given: 'Joe', family: 'Smith' },
        ],
        resource: {
          primary: {
            URL: arbitraryPrimaryUrl,
          },
        },
      },
    ];

    let authors: ReadonlyArray<string>;

    beforeEach(async () => {
      authors = await pipe(
        items,
        ingest,
        TE.getOrElse(shouldNotBeCalled),
        T.map((result) => result.understood[0].authors),
      )();
    });

    it('maintains the order of the authors', () => {
      expect(authors).toStrictEqual(['Fred Blogs', 'Joe Smith']);
    });
  });

  describe('when there is an Crossref review with no author field', () => {
    const items = [
      {
        URL: arbitraryUri(),
        created: { 'date-time': arbitraryDate().toString() },
        relation: { 'is-review-of': [{ id: arbitraryExpressionDoi() }] },
        resource: {
          primary: {
            URL: arbitraryPrimaryUrl,
          },
        },
      },
    ];

    let result: DiscoveredPublishedEvaluations;

    beforeEach(async () => {
      result = await pipe(
        items,
        ingest,
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns an evaluation with an empty array of authors', () => {
      expect(result.understood[0].authors).toStrictEqual([]);
    });
  });

  describe('when there is an Crossref review with an empty array for the author field', () => {
    const items = [
      {
        URL: arbitraryUri(),
        created: { 'date-time': arbitraryDate().toString() },
        relation: { 'is-review-of': [{ id: arbitraryExpressionDoi() }] },
        author: [],
        resource: {
          primary: {
            URL: arbitraryPrimaryUrl,
          },
        },
      },
    ];

    let result: DiscoveredPublishedEvaluations;

    beforeEach(async () => {
      result = await pipe(
        items,
        ingest,
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns an evaluation with an empty array of authors', () => {
      expect(result.understood[0].authors).toStrictEqual([]);
    });
  });

  describe('when there is an Crossref review from an author with only a family name', () => {
    const familyName = arbitraryWord();
    const items = [
      {
        URL: arbitraryUri(),
        created: { 'date-time': arbitraryDate().toString() },
        relation: { 'is-review-of': [{ id: arbitraryExpressionDoi() }] },
        author: [{ family: familyName }],
        resource: {
          primary: {
            URL: arbitraryPrimaryUrl,
          },
        },
      },
    ];

    let result: DiscoveredPublishedEvaluations;

    beforeEach(async () => {
      result = await pipe(
        items,
        ingest,
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns the evaluation including an author with that family name', () => {
      expect(result.understood[0].authors).toStrictEqual([
        familyName,
      ]);
    });
  });

  describe('when there is an Crossref review from an author with both a given name and a family name', () => {
    const givenName = arbitraryWord();
    const familyName = arbitraryWord();
    const items = [
      {
        URL: arbitraryUri(),
        created: { 'date-time': arbitraryDate().toString() },
        relation: { 'is-review-of': [{ id: arbitraryExpressionDoi() }] },
        author: [{
          given: givenName,
          family: familyName,
        }],
        resource: {
          primary: {
            URL: arbitraryPrimaryUrl,
          },
        },
      },
    ];

    let result: DiscoveredPublishedEvaluations;

    beforeEach(async () => {
      result = await pipe(
        items,
        ingest,
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns the evaluation including an author with both those names', () => {
      expect(result.understood[0].authors).toStrictEqual([
        `${givenName} ${familyName}`,
      ]);
    });
  });
});
