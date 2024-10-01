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
      describe('and the page 1 is selected', () => {
        const selectedPage = 1;
        const result = pipe(
          constructPaginationControls(
            pageSize,
            { categoryName: arbitraryString() as tt.NonEmptyString, page: selectedPage },
            2,
          ),
          O.getOrElseW(shouldNotBeCalled),
        );

        it.todo('returns backwardPageHref as none');

        it.todo('returns forwardPageHref as none');

        it('returns page as the selected page', () => {
          expect(result.page).toBe(selectedPage);
        });

        it('returns pageCount as 1', () => {
          expect(result.pageCount).toBe(1);
        });
      });
    });

    describe('when 12 items are available', () => {
      describe('and the page 2 is selected', () => {
        const selectedPage = 2;
        const result = pipe(
          constructPaginationControls(
            pageSize,
            { categoryName: arbitraryString() as tt.NonEmptyString, page: selectedPage },
            12,
          ), O.getOrElseW(shouldNotBeCalled),
        );

        it.todo('returns backwardPageHref as some');

        it.todo('returns forwardPageHref as none');

        it('returns page as the selected page', () => {
          expect(result.page).toBe(selectedPage);
        });

        it('returns pageCount as 2', () => {
          expect(result.pageCount).toBe(2);
        });
      });
    });
  });
});
