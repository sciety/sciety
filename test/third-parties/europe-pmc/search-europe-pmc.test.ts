import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { searchEuropePmc } from '../../../src/third-parties/europe-pmc';
import { dummyLogger } from '../../dummy-logger';
import { arbitraryNumber, arbitraryWord } from '../../helpers';
import * as EDOI from '../../../src/types/expression-doi';
import { SearchResults } from '../../../src/types/search-results';

describe('search-europe-pmc', () => {
  it('converts Europe PMC search result into our view model', async () => {
    const nextCursor = arbitraryWord();
    const queryExternalService = () => () => TE.right({
      hitCount: 3,
      nextCursorMark: nextCursor,
      resultList: {
        result: [
          {
            doi: '10.1111/1234',
          },
          {
            doi: '10.1111/4321',
          },
        ],
      },
    });
    const results = await searchEuropePmc(
      queryExternalService,
      dummyLogger,
    )(2)('some query', O.none, false)();

    const expected: E.Either<never, SearchResults> = E.right({
      total: 3,
      items: [
        EDOI.fromValidatedString('10.1111/1234'),
        EDOI.fromValidatedString('10.1111/4321'),
      ],
      nextCursor: O.some(nextCursor),
    });

    expect(results).toStrictEqual(expected);
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

    describe('when there are fewer results than the page size', () => {
      it('nextCursor should be none', async () => {
        const nextCursor = arbitraryWord();
        const queryExternalService = () => () => TE.right({
          hitCount: arbitraryNumber(0, 100),
          nextCursorMark: nextCursor,
          resultList: {
            result: [{
              doi: '10.1111/1234',
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
              },
              {
                doi: '10.1111/4321',
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
