import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { searchEuropePmc } from '../../../src/third-parties/europe-pmc';
import { Doi } from '../../../src/types/doi';
import { dummyLogger } from '../../dummy-logger';
import { arbitraryNumber, arbitraryWord } from '../../helpers';
import { SearchResults } from '../../../src/shared-ports/search-for-articles';

describe('search-europe-pmc adapter', () => {
  it('converts Europe PMC search result into our view model', async () => {
    const nextCursor = arbitraryWord();
    const results = await searchEuropePmc({
      getJson: async () => ({
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
      }),
      logger: dummyLogger,
    })(2)('some query', O.none, false)();

    const expected = E.right({
      total: 3,
      items: [
        {
          articleId: new Doi('10.1111/1234'),
          server: 'biorxiv',
          title: 'Article title',
          authors: O.some([
            'Author 1',
            'Author 2',
          ]),
        },
        {
          articleId: new Doi('10.1111/4321'),
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
    const results = await searchEuropePmc({
      getJson: async () => ({
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
      }),
      logger: dummyLogger,
    })(10)('some query', O.none, false)();

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
      results = await searchEuropePmc({
        getJson: async () => ({
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
        }),
        logger: dummyLogger,
      })(10)('some query', O.none, false)();
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
        const results = await searchEuropePmc({
          getJson: async () => ({
            hitCount: arbitraryNumber(0, 100),
            nextCursorMark: nextCursor,
            resultList: {
              result: [],
            },
          }),
          logger: dummyLogger,
        })(10)('some query', O.none, false)();

        expect(results).toStrictEqual(E.right(expect.objectContaining({
          nextCursor: O.none,
        })));
      });
    });

    describe('when there is no next cursor mark', () => {
      it('nextCursor should be none', async () => {
        const results = await searchEuropePmc({
          getJson: async () => ({
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
          }),
          logger: dummyLogger,
        })(10)('some query', O.none, false)();

        expect(results).toStrictEqual(E.right(expect.objectContaining({
          nextCursor: O.none,
        })));
      });
    });

    describe('when there are less results than the page size', () => {
      it('nextCursor should be none', async () => {
        const nextCursor = arbitraryWord();
        const results = await searchEuropePmc({
          getJson: async () => ({
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
          }),
          logger: dummyLogger,
        })(10)('some query', O.none, false)();

        expect(results).toStrictEqual(E.right(expect.objectContaining({
          nextCursor: O.none,
        })));
      });
    });

    describe('when result count equals page size', () => {
      it('nextCursor should be some', async () => {
        const nextCursor = arbitraryWord();
        const results = await searchEuropePmc({
          getJson: async () => ({
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
          }),
          logger: dummyLogger,
        })(2)('some query', O.none, false)();

        expect(results).toStrictEqual(E.right(expect.objectContaining({
          nextCursor: O.some(nextCursor),
        })));
      });
    });
  });
});
