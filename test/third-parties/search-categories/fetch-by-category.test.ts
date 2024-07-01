import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { fetchByCategory } from '../../../src/third-parties/search-categories';
import { dummyLogger } from '../../dummy-logger';
import { arbitraryString } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';

const responseWithValidDoi = { data: [{ attributes: { doi: arbitraryExpressionDoi() } }] };

describe('fetch-by-category', () => {
  describe('when an item with a valid doi syntax is returned', () => {
    const queryExternalService = () => () => TE.right(responseWithValidDoi);
    const invokeFetchByCategory = async (category: string) => pipe(
      category,
      fetchByCategory(queryExternalService, dummyLogger),
      TE.getOrElse(shouldNotBeCalled),
    )();

    let result: Awaited<ReturnType<typeof invokeFetchByCategory>>;

    beforeEach(async () => {
      result = await invokeFetchByCategory(arbitraryString());
    });

    it('is included', () => {
      expect(result).toHaveLength(1);
    });
  });

  describe('when an item with an invalid doi syntax is returned', () => {
    it.todo('is not included');
  });
});
