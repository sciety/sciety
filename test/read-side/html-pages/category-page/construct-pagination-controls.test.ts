import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as tt from 'io-ts-types';
import { constructPaginationControls } from '../../../../src/read-side/html-pages/category-page/construct-pagination-controls';
import { arbitraryString } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';

describe('construct-pagination-controls', () => {
  describe('given the page size is 10', () => {
    const pageSize = 10;

    describe('when 2 items are available', () => {
      describe('and page 1 is selected', () => {
        const selectedPage = 1;
        const result = constructPaginationControls(
          pageSize,
          { categoryName: arbitraryString() as tt.NonEmptyString, page: selectedPage },
          2,
        );

        it('returns backwardPageHref as none', () => {
          expect(O.isNone(result.backwardPageHref)).toBe(true);
        });

        it('returns forwardPageHref as none', () => {
          expect(O.isNone(result.forwardPageHref)).toBe(true);
        });

        it('returns page as the selected page', () => {
          expect(result.page).toBe(selectedPage);
        });

        it('returns pageCount as 1', () => {
          expect(result.pageCount).toBe(1);
        });
      });
    });

    describe('when 12 items are available', () => {
      describe('and page 1 is selected', () => {
        const selectedPage = 1;
        const nextPage = 2;
        const result = constructPaginationControls(
          pageSize,
          { categoryName: arbitraryString() as tt.NonEmptyString, page: selectedPage },
          12,
        );
        const forwardPageHrefValue = pipe(
          result.forwardPageHref,
          O.getOrElseW(shouldNotBeCalled),
        );

        it('returns backwardPageHref as none', () => {
          expect(O.isNone(result.backwardPageHref)).toBe(true);
        });

        it('returns the value of the next page, 2, in the page param of the forwardPageHref', () => {
          expect(forwardPageHrefValue).toContain(`page=${nextPage}`);
        });

        it('returns page as the selected page', () => {
          expect(result.page).toBe(selectedPage);
        });

        it('returns page count as 2', () => {
          expect(result.pageCount).toBe(2);
        });
      });

      describe('and page 2 is selected', () => {
        const selectedPage = 2;
        const previousPage = 1;
        const result = constructPaginationControls(
          pageSize,
          { categoryName: arbitraryString() as tt.NonEmptyString, page: selectedPage },
          12,
        );
        const backwardPageHrefValue = pipe(
          result.backwardPageHref,
          O.getOrElseW(shouldNotBeCalled),
        );

        it('returns the value of the previous page, 1, in the page param of the backwardPageHref', () => {
          expect(backwardPageHrefValue).toContain(`page=${previousPage}`);
        });

        it('returns forwardPageHref as none', () => {
          expect(O.isNone(result.forwardPageHref)).toBe(true);
        });

        it('returns page as the selected page', () => {
          expect(result.page).toBe(selectedPage);
        });

        it('returns pageCount as 2', () => {
          expect(result.pageCount).toBe(2);
        });
      });
    });

    describe('when 30 items are available', () => {
      describe('and page 2 is selected', () => {
        const selectedPage = 2;
        const previousPage = 1;
        const nextPage = 3;
        const result = constructPaginationControls(
          pageSize,
          { categoryName: arbitraryString() as tt.NonEmptyString, page: selectedPage },
          30,
        );
        const backwardPageHrefValue = pipe(
          result.backwardPageHref,
          O.getOrElseW(shouldNotBeCalled),
        );
        const forwardPageHrefValue = pipe(
          result.forwardPageHref,
          O.getOrElseW(shouldNotBeCalled),
        );

        it('returns the value of the previous page, 1, in the page param of the backwardPageHref', () => {
          expect(backwardPageHrefValue).toContain(`page=${previousPage}`);
        });

        it('returns the value of the next page, 3, in the page param of the forwardPageHref', () => {
          expect(forwardPageHrefValue).toContain(`page=${nextPage}`);
        });

        it('returns page as the selected page', () => {
          expect(result.page).toBe(selectedPage);
        });

        it('returns pageCount as 3', () => {
          expect(result.pageCount).toBe(3);
        });
      });
    });
  });
});
