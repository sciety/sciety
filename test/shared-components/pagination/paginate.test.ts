import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { paginate } from '../../../src/shared-components/pagination/paginate.js';
import * as DE from '../../../src/types/data-error.js';
import { shouldNotBeCalled } from '../../should-not-be-called.js';

const generateItems = (eventCount: number): ReadonlyArray<number> => pipe(
  Array(eventCount).keys(),
  Array.from,
  RA.map((k) => k as number),
);

const valueOf = O.getOrElseW(() => 'none');

describe('paginate', () => {
  describe('when there are multiple items', () => {
    const result = pipe(
      ['a', 'b', 'c'],
      paginate(1, 2),
      E.getOrElseW(shouldNotBeCalled),
    );

    it('limits the number of items to the requested page size', () => {
      expect(result.items).toHaveLength(1);
    });

    it('returns the specified page of the items', () => {
      expect(result.items).toStrictEqual(['b']);
    });

    it('returns the total pages', () => {
      expect(result.numberOfPages).toBe(3);
    });
  });

  describe('when there are no items', () => {
    const result = pipe(
      [],
      paginate(1, 1),
    );

    it('returns not found', () => {
      expect(result).toStrictEqual(E.left(DE.notFound));
    });
  });

  describe('when paginating with 10 items per page', () => {
    const itemsPerPage = 10;

    describe.each([
      [9, 1, O.none, O.none],
      [20, 2, O.none, O.some(1)],
      [21, 3, O.none, O.some(2)],
      [11, 1, O.some(2), O.none],
      [20, 1, O.some(2), O.none],
      [21, 2, O.some(3), O.some(1)],
    ])('given %d items and page %d is the current page', (itemCount, page, nextPage, prevPage) => {
      const result = pipe(
        generateItems(itemCount),
        paginate(itemsPerPage, page),
        E.getOrElseW(shouldNotBeCalled),
      );

      it(`returns ${itemCount} as the number of original items`, () => {
        expect(result.numberOfOriginalItems).toBe(itemCount);
      });

      it(`returns ${page} as the current page number`, () => {
        expect(result.pageNumber).toBe(page);
      });

      it(`returns ${valueOf(nextPage)} as nextPage`, () => {
        expect(result.nextPage).toStrictEqual(nextPage);
      });

      it(`returns ${valueOf(prevPage)} as prevPage`, () => {
        expect(result.prevPage).toStrictEqual(prevPage);
      });
    });
  });

  describe('when asked for a page that does not exist', () => {
    it('returns not-found', () => {
      const result = pipe(
        ['a', 'b', 'c'],
        paginate(1, 7),
      );

      expect(result).toStrictEqual(E.left(DE.notFound));
    });
  });
});
