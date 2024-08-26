import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Dependencies } from '../../../../src/ingest/discover-published-evaluations';
import { SelectedPage, determinePagesToSelect } from '../../../../src/ingest/evaluation-discovery/discover-access-microbiology-evaluations/determine-pages-to-select';
import { arbitraryString } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';

// eslint-disable-next-line jest/no-export
export const stubbedFetchData = (
  stubbedResponse: unknown,
) => <D>(): TE.TaskEither<never, D> => TE.right(stubbedResponse as unknown as D);

const invokeDeterminePagesToSelect = async (fetchDataImplementation: Dependencies['fetchData']) => pipe(
  { fetchData: fetchDataImplementation },
  determinePagesToSelect(1000),
)();

const invokeDeterminePagesToSelectAndEnsureIsOnTheRight = async (fetchDataImplementation: Dependencies['fetchData']) => pipe(
  await invokeDeterminePagesToSelect(fetchDataImplementation),
  E.getOrElseW(shouldNotBeCalled),
);

describe('determine-pages-to-select', () => {
  let selectedPages: ReadonlyArray<SelectedPage>;

  describe('when the total number of items is 0', () => {
    const fetchDataImplementation = stubbedFetchData({ message: { 'total-results': 0 } });

    beforeEach(async () => {
      selectedPages = await invokeDeterminePagesToSelectAndEnsureIsOnTheRight(fetchDataImplementation);
    });

    it('selects no pages', () => {
      expect(selectedPages).toHaveLength(0);
    });
  });

  describe('when the total number of items is less than the page size', () => {
    const fetchDataImplementation = stubbedFetchData({ message: { 'total-results': 800 } });

    beforeEach(async () => {
      selectedPages = await invokeDeterminePagesToSelectAndEnsureIsOnTheRight(fetchDataImplementation);
    });

    it('selects one page of offset 0', () => {
      expect(selectedPages).toStrictEqual([expect.objectContaining({ offset: 0 })]);
    });
  });

  describe('when the total number of items is greater than the page size, but less than twice the page size', () => {
    const fetchDataImplementation = stubbedFetchData({ message: { 'total-results': 1800 } });

    beforeEach(async () => {
      selectedPages = await invokeDeterminePagesToSelectAndEnsureIsOnTheRight(fetchDataImplementation);
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
    const fetchDataImplementation = () => TE.left(failureMessage);
    let result: E.Either<unknown, unknown>;

    beforeEach(async () => {
      result = await invokeDeterminePagesToSelect(fetchDataImplementation);
    });

    it('returns on the left', () => {
      expect(result).toStrictEqual(E.left(failureMessage));
    });
  });

  describe('when the API response cannot be decoded', () => {
    let result: E.Either<unknown, unknown>;
    const fetchDataImplementation = stubbedFetchData({ foo: 'bar' });

    beforeEach(async () => {
      result = await invokeDeterminePagesToSelect(fetchDataImplementation);
    });

    it('returns on the left', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });
});
