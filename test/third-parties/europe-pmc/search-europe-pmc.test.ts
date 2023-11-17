import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { searchEuropePmc } from '../../../src/third-parties/europe-pmc/index.js';
import { ArticleId } from '../../../src/types/article-id.js';
import { dummyLogger } from '../../dummy-logger.js';
import { arbitraryNumber, arbitraryWord } from '../../helpers.js';
import { SearchResults } from '../../../src/shared-ports/search-for-articles.js';

describe('search-europe-pmc adapter', () => {
  it('converts Europe PMC search result into our view model', async () => {
    const nextCursor = arbitraryWord();
    const queryExternalService = () => () => TE.right({
      hitCount: 3,
      nextCursorMark: nextCursor,
      resultList: {
        result: [
          {
            doi: '10.1111/1234',
            title: 'Article title',
            authorList: {
              author: [
                { fullName: 'Author 1' },
                { fullName: 'Author 2' },
              ],
            },
            bookOrReportDetails: {
              publisher: 'bioRxiv',
            },
          },
          {
            doi: '10.1111/4321',
            title: 'Another Article title',
            authorList: {
              author: [
                { fullName: 'Author 3' },
                { fullName: 'Author 4' },
              ],
            },
            bookOrReportDetails: {
              publisher: 'bioRxiv',
            },
          },
        ],
      },
    });
    const results = await searchEuropePmc(
      queryExternalService,
      dummyLogger,
    )(2)('some query', O.none, false)();

    const expected = E.right({
      total: 3,
      items: [
        {
          articleId: new ArticleId('10.1111/1234'),
          server: 'biorxiv',
          title: 'Article title',
          authors: O.some([
            'Author 1',
            'Author 2',
          ]),
        },
        {
          articleId: new ArticleId('10.1111/4321'),
          server: 'biorxiv',
          title: 'Another Article title',
          authors: O.some([
            'Author 3',
            'Author 4',
          ]),
        },
      ],
      nextCursor: O.some(nextCursor),
    });

    expect(results).toStrictEqual(expected);
  });

  it('handles collective name and full name authors', async () => {
    const queryExternalService = () => () => TE.right({
      hitCount: 1,
      nextCursorMark: arbitraryWord(),
      resultList: {
        result: [
          {
            doi: '10.1111/1234',
            title: 'Article title',
            authorList: {
              author: [
                { fullName: 'Full Name' },
                { collectiveName: 'Collective Name' },
              ] as const,
            },
            bookOrReportDetails: {
              publisher: 'bioRxiv',
            },
          },
        ],
      },
    });
    const results = await searchEuropePmc(
      queryExternalService,
      dummyLogger,
    )(10)('some query', O.none, false)();

    const expected = E.right(expect.objectContaining({
      items: [
        expect.objectContaining({
          authors: O.some([
            'Full Name',
            'Collective Name',
          ]),
        }),
      ],
    }));

    expect(results).toStrictEqual(expected);
  });

  describe('when there is no authorList', () => {
    let results: E.Either<unknown, SearchResults>;

    beforeEach(async () => {
      const queryExternalService = () => () => TE.right({
        hitCount: 1,
        nextCursorMark: arbitraryWord(),
        resultList: {
          result: [
            {
              doi: '10.1111/1234',
              title: 'Article title',
              bookOrReportDetails: {
                publisher: 'bioRxiv',
              },
            },
          ],
        },
      });
      results = await searchEuropePmc(
        queryExternalService,
        dummyLogger,
      )(10)('some query', O.none, false)();
    });

    it('returns a result with None as authors', async () => {
      expect(results).toStrictEqual(E.right(expect.objectContaining({
        items: [
          expect.objectContaining({
            authors: O.none,
          }),
        ],
      })));
    });
  });

  describe('nextCursor', () => {
    describe('when there are no results', () => {
      it('nextCursor should be none', async () => {
        const nextCursor = arbitraryWord();
        const queryExternalService = () => () => TE.right({
          hitCount: arbitraryNumber(0, 100),
          nextCursorMark: nextCursor,
          resultList: {
            result: [],
          },
        });
        const results = await searchEuropePmc(
          queryExternalService,
          dummyLogger,
        )(10)('some query', O.none, false)();

        expect(results).toStrictEqual(E.right(expect.objectContaining({
          nextCursor: O.none,
        })));
      });
    });

    describe('when there is no next cursor mark', () => {
      it('nextCursor should be none', async () => {
        const queryExternalService = () => () => TE.right({
          hitCount: arbitraryNumber(0, 100),
          resultList: {
            result: [{
              doi: '10.1111/1234',
              title: 'Article title',
              authorList: {
                author: [],
              },
              bookOrReportDetails: {
                publisher: 'bioRxiv',
              },
            }],
          },
        });
        const results = await searchEuropePmc(
          queryExternalService,
          dummyLogger,
        )(10)('some query', O.none, false)();

        expect(results).toStrictEqual(E.right(expect.objectContaining({
          nextCursor: O.none,
        })));
      });
    });

    describe('when there are less results than the page size', () => {
      it('nextCursor should be none', async () => {
        const nextCursor = arbitraryWord();
        const queryExternalService = () => () => TE.right({
          hitCount: arbitraryNumber(0, 100),
          nextCursorMark: nextCursor,
          resultList: {
            result: [{
              doi: '10.1111/1234',
              title: 'Article title',
              authorList: {
                author: [],
              },
              bookOrReportDetails: {
                publisher: 'bioRxiv',
              },
            }],
          },
        });
        const results = await searchEuropePmc(
          queryExternalService,
          dummyLogger,
        )(10)('some query', O.none, false)();

        expect(results).toStrictEqual(E.right(expect.objectContaining({
          nextCursor: O.none,
        })));
      });
    });

    describe('when result count equals page size', () => {
      it('nextCursor should be some', async () => {
        const nextCursor = arbitraryWord();
        const queryExternalService = () => () => TE.right({
          hitCount: arbitraryNumber(3, 100),
          nextCursorMark: nextCursor,
          resultList: {
            result: [
              {
                doi: '10.1111/1234',
                title: 'Article title',
                authorList: {
                  author: [
                    { fullName: 'Author 1' },
                    { fullName: 'Author 2' },
                  ],
                },
                bookOrReportDetails: {
                  publisher: 'bioRxiv',
                },
              },
              {
                doi: '10.1111/4321',
                title: 'Another Article title',
                authorList: {
                  author: [
                    { fullName: 'Author 3' },
                    { fullName: 'Author 4' },
                  ],
                },
                bookOrReportDetails: {
                  publisher: 'bioRxiv',
                },
              },
            ],
          },
        });
        const results = await searchEuropePmc(
          queryExternalService,
          dummyLogger,
        )(2)('some query', O.none, false)();

        expect(results).toStrictEqual(E.right(expect.objectContaining({
          nextCursor: O.some(nextCursor),
        })));
      });
    });
  });
});
