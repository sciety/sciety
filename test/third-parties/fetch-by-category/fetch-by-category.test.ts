import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { fetchByCategory } from '../../../src/third-parties/fetch-by-category/fetch-by-category';
import { dummyLogger } from '../../dummy-logger';
import { arbitraryNumber, arbitraryString } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';

const doiWithValidSyntax = arbitraryExpressionDoi();
const metaTotalValue = arbitraryNumber(1, 1000);

const responseWithValidDoi = {
  data: [{ attributes: { doi: doiWithValidSyntax.toString() } }],
  meta: { total: metaTotalValue },
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

    it('includes the item with the valid doi syntax in expressionDois', () => {
      expect(result.expressionDois).toHaveLength(1);
      expect(result.expressionDois[0]).toBe(doiWithValidSyntax);
    });

    it('includes the total number of items', () => {
      expect(result.totalItems).toBe(metaTotalValue);
    });
  });

  describe('when an item with an invalid doi syntax is returned', () => {
    beforeEach(async () => {
      result = await invokeFetchByCategory(arbitraryString(), responseWithInvalidDoi);
    });

    it('does not include the item with an invalid doi syntax in expressionDois', () => {
      expect(result.expressionDois).toHaveLength(0);
    });
  });
});
