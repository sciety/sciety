import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { constructDefaultPaginationControls } from '../../../../src/html-pages/shared-components/pagination';
import { shouldNotBeCalled } from '../../../should-not-be-called';

describe('construct-default-pagination-controls', () => {
  describe('given a path with no query string parameters', () => {
    const path = '/foo';

    describe('when there is a forwardPage of items', () => {
      const forwardPageNumber = 2;
      let result: string;

      beforeEach(() => {
        result = pipe(
          constructDefaultPaginationControls(path, {
            items: ['a', 'b'],
            backwardPage: O.none,
            forwardPage: O.some(forwardPageNumber),
            pageNumber: 1,
            numberOfPages: 2,
            numberOfOriginalItems: 4,
          }),
          (viewModel) => viewModel.forwardPageHref,
          O.getOrElseW(shouldNotBeCalled),
        );
      });

      it('the path of the forwardPageHref is this path', () => {
        expect(result.startsWith('/foo?')).toBe(true);
      });

      it('the query string of the forwardPageHref requests the page parameter to be the forwardPage value', () => {
        expect(result.endsWith(`?page=${forwardPageNumber}`)).toBe(true);
      });
    });

    describe('when there is a backwardPage of items', () => {
      const backwardPageNumber = 1;
      let result: string;

      beforeEach(() => {
        result = pipe(
          constructDefaultPaginationControls(path, {
            items: ['a', 'b'],
            backwardPage: O.some(backwardPageNumber),
            forwardPage: O.none,
            pageNumber: 2,
            numberOfPages: 2,
            numberOfOriginalItems: 4,
          }),
          (viewModel) => viewModel.backwardPageHref,
          O.getOrElseW(shouldNotBeCalled),
        );
      });

      it('the path of the backwardPageHref is this path', () => {
        expect(result.startsWith('/foo?')).toBe(true);
      });

      it.todo('the query string of the backwardPageHref requests the page parameter to be the backwardPage value');
    });
  });
});
