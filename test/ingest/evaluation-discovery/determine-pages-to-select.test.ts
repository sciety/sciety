import * as TE from 'fp-ts/TaskEither';
import { determinePagesToSelect } from '../../../src/ingest/evaluation-discovery/determine-pages-to-select';

const fetchData = (stubbedResponse: unknown) => <D>() => TE.right(stubbedResponse as unknown as D);

describe('determine-pages-to-select', () => {
  describe('when the total number of items is 0', () => {
    const result = determinePagesToSelect({ fetchData: fetchData({ message: { 'total-results': 0 } }) });

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
});
