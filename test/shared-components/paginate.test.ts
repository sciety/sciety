import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { paginate } from '../../src/shared-components/paginate';
import * as DE from '../../src/types/data-error';
import { shouldNotBeCalled } from '../should-not-be-called';

const generateItems = (eventCount: number): ReadonlyArray<number> => pipe(
  Array(eventCount).keys(),
  Array.from,
  RA.map((k) => k as number),
);

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

    it('returns the current and total pages', () => {
      expect(result.pageNumber).toStrictEqual(2);
      expect(result.numberOfPages).toStrictEqual(3);
    });

    it('returns the count of original items', () => {
      expect(result.numberOfOriginalItems).toStrictEqual(3);
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

  describe('next page', () => {
    it.each([
      [9, 1, O.none],
      [11, 1, O.some(2)],
      [20, 1, O.some(2)],
      [20, 2, O.none],
      [21, 2, O.some(3)],
      [21, 3, O.none],
    ])('given %d items and a request for page %d, returns the next page', (itemCount, page, nextPage) => {
      const result = pipe(
        generateItems(itemCount),
        paginate(10, page),
        E.getOrElseW(shouldNotBeCalled),
      );

      expect(result.nextPage).toStrictEqual(nextPage);
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
