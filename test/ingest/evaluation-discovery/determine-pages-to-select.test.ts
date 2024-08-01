import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { SelectedPage, determinePagesToSelect } from '../../../src/ingest/evaluation-discovery/determine-pages-to-select';
import { shouldNotBeCalled } from '../../should-not-be-called';

const fetchData = (stubbedResponse: unknown) => <D>() => TE.right(stubbedResponse as unknown as D);

describe('determine-pages-to-select', () => {
  let result: ReadonlyArray<SelectedPage>;

  describe('when the total number of items is 0', () => {
    beforeEach(async () => {
      result = await pipe(
        determinePagesToSelect({ fetchData: fetchData({ message: { 'total-results': 0 } }) }),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it.failing('selects no pages', () => {
      expect(result).toHaveLength(0);
    });
  });

  describe('when the total number of items is less than the page size', () => {
    it.todo('selects one page of offset 0');
  });

  describe('when the total number of items is greater than the page size, but less than twice the page size', () => {
    it.todo('selects two pages of offset 0 and 1000');
  });

  describe('when the API call fails', () => {
    it.todo('returns on the left');
  });
});
