import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { fetchByCategory } from '../../../src/third-parties/fetch-by-category/fetch-by-category';
import { dummyLogger } from '../../dummy-logger';
import { arbitraryString } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';

const doiWithValidSyntax = arbitraryExpressionDoi();

const responseWithValidDoi = {
  data: [{ attributes: { doi: doiWithValidSyntax.toString() } }],
  meta: { total: 1 },
};

const responseWithInvalidDoi = {
  data: [{ attributes: { doi: arbitraryString() } }],
  meta: { total: 1 },
};

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
      expect(result.expressionDois).toHaveLength(1);
      expect(result.expressionDois[0]).toBe(doiWithValidSyntax);
    });
  });

  describe('when an item with an invalid doi syntax is returned', () => {
    beforeEach(async () => {
      result = await invokeFetchByCategory(arbitraryString(), responseWithInvalidDoi);
    });

    it('is not included', () => {
      expect(result.expressionDois).toHaveLength(0);
    });
  });
});
