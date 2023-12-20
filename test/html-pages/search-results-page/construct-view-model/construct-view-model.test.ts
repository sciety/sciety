import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel } from '../../../../src/html-pages/search-results-page/construct-view-model/construct-view-model';
import { ViewModel } from '../../../../src/html-pages/search-results-page/view-model';
import { TestFramework, createTestFramework } from '../../../framework';
import { arbitraryString, arbitraryWord } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { ExternalQueries } from '../../../../src/third-parties';
import { ExpressionDoi } from '../../../../src/types/expression-doi';
import { arbitraryExpressionDoi } from '../../../types/expression-doi.helper';
import { SearchResults } from '../../../../src/third-parties/external-queries';

const searchForPaperExpressionsReturningResults = (
  expressionDois: SearchResults['items'],
  total: SearchResults['total'],
  nextCursor: SearchResults['nextCursor'],
) => () => () => TE.right({
  items: expressionDois,
  total,
  nextCursor,
});

const searchForPaperExpressionsReturningNoResults = () => () => TE.right({
  items: [],
  total: 0,
  nextCursor: O.none,
});

describe('construct-view-model', () => {
  let framework: TestFramework;
  let defaultDependencies: TestFramework['dependenciesForViews'];

  beforeEach(() => {
    framework = createTestFramework();
    defaultDependencies = framework.dependenciesForViews;
  });

  let result: ViewModel;

  const query = arbitraryString();
  const cursor = O.none;
  const page = O.none;
  const evaluatedOnly = false;

  const getViewModel = async (searchForPaperExpressions: ExternalQueries['searchForPaperExpressions'], itemsPerPage: number = 1) => pipe(
    {
      query, cursor, page, evaluatedOnly,
    },
    constructViewModel(
      {
        ...defaultDependencies,
        searchForPaperExpressions,
      },
      itemsPerPage,
    ),
    TE.getOrElse(shouldNotBeCalled),
  )();

  const getViewModelForASinglePage = async (
    expressionDois: ReadonlyArray<ExpressionDoi>,
  ) => getViewModel(
    searchForPaperExpressionsReturningResults(expressionDois, 1, O.none),
  );

  const getViewModelWithAdditionalPages = async (
    expressionDoi: ExpressionDoi,
    cursorValue: string,
    itemsPerPage: number,
  ) => getViewModel(
    searchForPaperExpressionsReturningResults([expressionDoi], 2, O.some(cursorValue)),
    itemsPerPage,
  );

  const getViewModelForAPageWithNoResults = async () => getViewModel(
    searchForPaperExpressionsReturningNoResults,
  );

  describe('and there is only one page of results, with no evaluated articles', () => {
    const expressionDoi = arbitraryExpressionDoi();

    beforeEach(async () => {
      result = await getViewModelForASinglePage([expressionDoi]);
    });

    it('all article cards are included in the view model', () => {
      expect(result.paperActivitySummaryCards).toStrictEqual(
        [
          expect.objectContaining({
            inputExpressionDoi: expressionDoi,
          }),
        ],
      );
    });

    it('the query is displayed', () => {
      expect(result.query).toBe(query);
    });

    it('the state of the filter for evaluated articles is displayed', () => {
      expect(result.evaluatedOnly).toBe(false);
    });
  });

  describe('and there is more than one page of results, with no evaluated articles', () => {
    const expressionDoi = arbitraryExpressionDoi();
    const itemsPerPage = 1;
    const cursorValue = arbitraryWord();

    beforeEach(async () => {
      result = await getViewModelWithAdditionalPages(expressionDoi, cursorValue, itemsPerPage);
    });

    it('no more than itemsPerPage article cards are included in the view model', () => {
      expect(result.paperActivitySummaryCards).toStrictEqual(
        [
          expect.objectContaining({
            inputExpressionDoi: expressionDoi,
          }),
        ],
      );
    });

    it('the query is displayed', () => {
      expect(result.query).toBe(query);
    });

    it('the state of the filter for evaluated articles is displayed', () => {
      expect(result.evaluatedOnly).toBe(false);
    });

    it('the current page number is displayed', () => {
      expect(result.pageNumber).toBe(1);
    });

    it('the total number of pages is displayed', () => {
      expect(result.numberOfPages).toBe(2);
    });
  });

  describe('but there are no results', () => {
    beforeEach(async () => {
      result = await getViewModelForAPageWithNoResults();
    });

    it('there are no article cards included in the view model', () => {
      expect(result.paperActivitySummaryCards).toStrictEqual([]);
    });

    it('the query is displayed', () => {
      expect(result.query).toBe(query);
    });

    it('the state of the filter for evaluated articles is displayed', () => {
      expect(result.evaluatedOnly).toBe(false);
    });
  });
});
