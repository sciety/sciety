import * as tt from 'io-ts-types';
import { constructPaginationControls } from '../../../../src/read-side/html-pages/category-page/construct-pagination-controls';
import { arbitraryString } from '../../../helpers';

describe('construct-pagination-controls', () => {
  describe('given the page size is 10', () => {
    const pageSize = 10;

    describe('when two items are available', () => {
      describe('and the page one is selected', () => {
        const result = constructPaginationControls(
          pageSize,
          { categoryName: arbitraryString() as tt.NonEmptyString, page: 1 },
          2,
        );

        it.todo('returns backwardPageHref as none');

        it.todo('returns forwardPageHref as none');

        it('returns page as 1', () => {
          expect(result.page).toBe(1);
        });

        it('returns pageCount as 1', () => {
          expect(result.pageCount).toBe(1);
        });
      });
    });

    describe('when twelve items are available', () => {
      describe('and the page two is selected', () => {
        const result = constructPaginationControls(
          pageSize,
          { categoryName: arbitraryString() as tt.NonEmptyString, page: 2 },
          12,
        );

        it.todo('returns backwardPageHref as some');

        it.todo('returns forwardPageHref as none');

        it('returns page as 2', () => {
          expect(result.page).toBe(2);
        });

        it('returns pageCount as 2', () => {
          expect(result.pageCount).toBe(2);
        });
      });
    });
  });
});
