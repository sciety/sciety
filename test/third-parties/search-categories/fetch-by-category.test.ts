import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { fetchByCategory } from '../../../src/third-parties/search-categories';
import { dummyLogger } from '../../dummy-logger';
import { arbitraryString } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';

const responseWithValidDoi = { data: [{ attributes: { doi: arbitraryExpressionDoi() } }] };

const dummyQueryExternalService = (queryResponse: unknown) => () => () => TE.right(queryResponse);

const invokeFetchByCategory = async (category: string, queryResponse: unknown) => pipe(
  category,
  fetchByCategory(dummyQueryExternalService(queryResponse), dummyLogger),
  TE.getOrElse(shouldNotBeCalled),
)();

describe('fetch-by-category', () => {
  let result: Awaited<ReturnType<typeof invokeFetchByCategory>>;

  describe('when an item with a valid doi syntax is returned', () => {
    beforeEach(async () => {
      result = await invokeFetchByCategory(arbitraryString(), responseWithValidDoi);
    });

    it('is included', () => {
      expect(result).toHaveLength(1);
    });
  });

  describe('when an item with an invalid doi syntax is returned', () => {
    it.todo('is not included');
  });
});
