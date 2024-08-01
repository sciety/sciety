import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { SelectedPage, determinePagesToSelect } from '../../../src/ingest/evaluation-discovery/determine-pages-to-select';
import { arbitraryString } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';

const fetchData = (stubbedResponse: unknown) => <D>() => TE.right(stubbedResponse as unknown as D);

describe('determine-pages-to-select', () => {
  let selectedPages: ReadonlyArray<SelectedPage>;

  describe('when the total number of items is 0', () => {
    beforeEach(async () => {
      selectedPages = await pipe(
        { fetchData: fetchData({ message: { 'total-results': 0 } }) },
        determinePagesToSelect(10),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('selects no pages', () => {
      expect(selectedPages).toHaveLength(0);
    });
  });

  describe('when the total number of items is less than the page size', () => {
    beforeEach(async () => {
      selectedPages = await pipe(
        { fetchData: fetchData({ message: { 'total-results': 800 } }) },
        determinePagesToSelect(1000),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('selects one page of offset 0', () => {
      expect(selectedPages).toStrictEqual([expect.objectContaining({ offset: 0 })]);
    });
  });

  describe('when the total number of items is greater than the page size, but less than twice the page size', () => {
    beforeEach(async () => {
      selectedPages = await pipe(
        { fetchData: fetchData({ message: { 'total-results': 1800 } }) },
        determinePagesToSelect(1000),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('selects two pages of offset 0 and 1000', () => {
      expect(selectedPages).toStrictEqual([
        expect.objectContaining({ offset: 0 }),
        expect.objectContaining({ offset: 1000 }),
      ]);
    });
  });

  describe('when the API call fails', () => {
    const failureMessage = arbitraryString();
    let result: E.Either<unknown, unknown>;

    beforeEach(async () => {
      result = await pipe(
        { fetchData: () => TE.left(failureMessage) },
        determinePagesToSelect(1000),
      )();
    });

    it('returns on the left', () => {
      expect(result).toStrictEqual(E.left(failureMessage));
    });
  });

  describe('when the API response cannot be understood', () => {
    it.todo('returns on the left');
  });
});
