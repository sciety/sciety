import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { Json } from 'io-ts-types';
import { searchEuropePmc } from '../../../src/third-parties/europe-pmc';
import { Doi } from '../../../src/types/doi';
import { dummyLogger } from '../../dummy-logger';
import { arbitraryNumber, arbitraryString, arbitraryWord } from '../../helpers';

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
    })(2)('some query', O.none)();

    const expected = E.right({
      total: 3,
      items: [
        {
          doi: new Doi('10.1111/1234'),
          server: 'biorxiv',
          title: 'Article title',
          authors: O.some([
            'Author 1',
            'Author 2',
          ]),
        },
        {
          doi: new Doi('10.1111/4321'),
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
    })(10)('some query', O.none)();

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

  it('constructs the Europe PMC query safely', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const getJson = async (url: string): Promise<Json> => ({
      hitCount: 0,
      resultList: {
        result: [],
      },
    });
    const spy = jest.fn(getJson);

    await searchEuropePmc({ getJson: spy, logger: dummyLogger })(10)('Structural basis of αE&', O.none)();

    expect(spy).toHaveBeenCalledTimes(1);

    const uri = spy.mock.calls[0][0];

    // Tests special character encoding, biorxiv publisher or medrxiv publisher, sort date, and parameter order.
    expect(uri).toContain('?query=Structural+basis+of+%CE%B1E%26+%28PUBLISHER%3A%22bioRxiv%22+OR+PUBLISHER%3A%22medRxiv%22%29+sort_date%3Ay&');
  });

  it('passes the cursorMark query parameter', async () => {
    const getJson = jest.fn();

    const unencodedCursor = 'AoJwgP+ir/YCKDQyNzg1Mjky';
    const encodedCursor = 'AoJwgP%2Bir%2FYCKDQyNzg1Mjky';

    await searchEuropePmc({ getJson, logger: dummyLogger })(10)(arbitraryString(), O.some(unencodedCursor))();

    expect(getJson).toHaveBeenCalledWith(expect.stringContaining(`cursorMark=${encodedCursor}`));
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
        })(10)('some query', O.none)();

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
        })(10)('some query', O.none)();

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
        })(10)('some query', O.none)();

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
        })(2)('some query', O.none)();

        expect(results).toStrictEqual(E.right(expect.objectContaining({
          nextCursor: O.some(nextCursor),
        })));
      });
    });
  });
});
