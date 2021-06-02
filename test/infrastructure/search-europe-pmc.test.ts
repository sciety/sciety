import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { Json } from 'io-ts-types';
import { searchEuropePmc } from '../../src/infrastructure/search-europe-pmc';
import { Doi } from '../../src/types/doi';
import { dummyLogger } from '../dummy-logger';
import { arbitraryString, arbitraryWord } from '../helpers';

describe('search-europe-pmc adapter', () => {
  it('converts Europe PMC search result into our view model', async () => {
    const nextCursor = arbitraryWord();
    const results = await searchEuropePmc(10)('some query', O.none)({
      getJson: async () => ({
        hitCount: 1,
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
              firstPublicationDate: '2019-11-07',
              bookOrReportDetails: {
                publisher: 'bioRxiv',
              },
            },
          ],
        },
      }),
      logger: dummyLogger,
    })();

    const expected = E.right({
      total: 1,
      items: [
        {
          doi: new Doi('10.1111/1234'),
          server: 'biorxiv',
          title: 'Article title',
          authors: [
            'Author 1',
            'Author 2',
          ],
          postedDate: new Date('2019-11-07'),
        },
      ],
      nextCursor: O.some(nextCursor),
    });

    expect(results).toStrictEqual(expected);
  });

  it('handles collective name and full name authors', async () => {
    const results = await searchEuropePmc(10)('some query', O.none)({
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
              firstPublicationDate: '2019-11-07',
              bookOrReportDetails: {
                publisher: 'bioRxiv',
              },
            },
          ],
        },
      }),
      logger: dummyLogger,
    })();

    const expected = E.right(expect.objectContaining({
      items: [
        expect.objectContaining({
          authors: [
            'Full Name',
            'Collective Name',
          ],
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

    await searchEuropePmc(10)('Structural basis of αE&', O.none)({ getJson: spy, logger: dummyLogger })();

    expect(spy).toHaveBeenCalledTimes(1);

    const uri = spy.mock.calls[0][0];

    // Tests special character encoding, biorxiv publisher or medrxiv publisher, sort date, and parameter order.
    expect(uri).toContain('?query=Structural+basis+of+%CE%B1E%26+%28PUBLISHER%3A%22bioRxiv%22+OR+PUBLISHER%3A%22medRxiv%22%29+sort_date%3Ay&');
  });

  it('passes the cursorMark query parameter', async () => {
    const getJson = async (): Promise<Json> => ({
      hitCount: 0,
      resultList: {
        result: [],
      },
    });

    const cursor = arbitraryWord();
    const spy = jest.fn(getJson);

    await searchEuropePmc(10)(arbitraryString(), O.some(cursor))({ getJson: spy, logger: dummyLogger })();

    expect(spy).toHaveBeenCalledWith(expect.stringContaining(`cursorMark=${cursor}`));
  });

  describe('nextCursor', () => {
    describe('when there are no results', () => {
      it.todo('nextCursor should be none');
    });

    describe('when there are less results than the page size', () => {
      it.todo('nextCursor should be none');
    });

    describe('when result count equals page size', () => {
      it.todo('nextCursor should be some');
    });
  });
});
