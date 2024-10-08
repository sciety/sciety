import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel } from '../../../../../src/read-side/html-pages/search-results-page/construct-view-model/construct-view-model';
import { ViewModel } from '../../../../../src/read-side/html-pages/search-results-page/view-model';
import { ExternalQueries } from '../../../../../src/third-parties';
import { ExpressionDoi } from '../../../../../src/types/expression-doi';
import { SearchResults } from '../../../../../src/types/search-results';
import { TestFramework, createTestFramework } from '../../../../framework';
import { arbitraryBoolean, arbitraryString, arbitraryWord } from '../../../../helpers';
import { shouldNotBeCalled } from '../../../../should-not-be-called';
import { arbitraryExpressionDoi } from '../../../../types/expression-doi.helper';

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
  const includeUnevaluatedPreprints = arbitraryBoolean();

  const getViewModel = async (searchForPaperExpressions: ExternalQueries['searchForPaperExpressions'], itemsPerPage: number = 1) => pipe(
    {
      query, cursor, page, includeUnevaluatedPreprints,
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

  describe('when there is only one page of results', () => {
    const expressionDoi = arbitraryExpressionDoi();
    let cardHrefs: ReadonlyArray<string>;

    beforeEach(async () => {
      result = await getViewModelForASinglePage([expressionDoi]);
      cardHrefs = pipe(
        result.paperActivitySummaryCards,
        RA.map((card) => card.paperActivityPageHref),
      );
    });

    it('all article cards are included in the view model', () => {
      expect(cardHrefs).toHaveLength(1);
      expect(cardHrefs[0]).toContain(expressionDoi);
    });

    it('the query is displayed', () => {
      expect(result.query).toBe(query);
    });

    it('the state of the toggle for unevaluatedPreprints matches the params', () => {
      expect(result.includeUnevaluatedPreprints).toBe(includeUnevaluatedPreprints);
    });
  });

  describe('when there is more than one page of results', () => {
    const expressionDoi = arbitraryExpressionDoi();
    const itemsPerPage = 1;
    const cursorValue = arbitraryWord();

    beforeEach(async () => {
      result = await getViewModelWithAdditionalPages(expressionDoi, cursorValue, itemsPerPage);
    });

    it('no more than itemsPerPage article cards are included in the view model', () => {
      expect(result.paperActivitySummaryCards).toHaveLength(1);
    });

    it('the query is displayed', () => {
      expect(result.query).toBe(query);
    });

    it('the state of the toggle for unevaluatedPreprints matches the params', () => {
      expect(result.includeUnevaluatedPreprints).toBe(includeUnevaluatedPreprints);
    });

    it('the current page number is displayed', () => {
      expect(result.pageNumber).toBe(1);
    });

    it('the total number of pages is displayed', () => {
      expect(result.numberOfPages).toBe(2);
    });
  });

  describe('when there are no results', () => {
    beforeEach(async () => {
      result = await getViewModelForAPageWithNoResults();
    });

    it('there are no article cards included in the view model', () => {
      expect(result.paperActivitySummaryCards).toStrictEqual([]);
    });

    it('the query is displayed', () => {
      expect(result.query).toBe(query);
    });

    it('the state of the toggle for unevaluatedPreprints matches the params', () => {
      expect(result.includeUnevaluatedPreprints).toBe(includeUnevaluatedPreprints);
    });
  });
});
