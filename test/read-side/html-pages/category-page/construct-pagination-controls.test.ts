import * as tt from 'io-ts-types';
import { constructPaginationControls } from '../../../../src/read-side/html-pages/category-page/construct-pagination-controls';
import { arbitraryString } from '../../../helpers';

describe('construct-pagination-controls', () => {
  describe('when two items are available', () => {
    describe('and the page one is selected', () => {
      const result = constructPaginationControls(
        10,
        { categoryName: arbitraryString() as tt.NonEmptyString, page: 1 },
        2,
      );

      it.todo('returns backwardPageHref as none');

      it.todo('returns forwardPageHref as none');

      it('returns page as 1', () => {
        expect(result.page).toBe(1);
      });

      it.todo('returns pageCount as 1');
    });
  });
});
