import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel } from '../../../../src/html-pages/search-results-page/construct-view-model/construct-view-model';
import { ViewModel } from '../../../../src/html-pages/search-results-page/view-model';
import { TestFramework, createTestFramework } from '../../../framework';
import { arbitrarySanitisedHtmlFragment, arbitraryString, arbitraryWord } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { arbitraryArticleServer } from '../../../types/article-server.helper';
import { ArticleId } from '../../../../src/types/article-id';
import { ExternalQueries } from '../../../../src/third-parties';

const searchForArticlesReturningResults = (
  articleIds: ReadonlyArray<ArticleId>,
  total: number,
  nextCursor: O.Option<string>,
) => () => () => TE.right({
  items: pipe(
    articleIds,
    RA.map((articleId) => ({
      articleId,
      server: arbitraryArticleServer(),
      title: arbitrarySanitisedHtmlFragment(),
      authors: O.none,
    })),
  ),
  total,
  nextCursor,
});

const searchForArticlesReturningNoResults = () => () => TE.right({
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

  const getViewModel = async (searchForArticles: ExternalQueries['searchForArticles'], itemsPerPage: number = 1) => pipe(
    {
      query, cursor, page, evaluatedOnly,
    },
    constructViewModel(
      {
        ...defaultDependencies,
        searchForArticles,
      },
      itemsPerPage,
    ),
    TE.getOrElse(shouldNotBeCalled),
  )();

  const getViewModelForASinglePage = async (
    articleIds: ReadonlyArray<ArticleId>,
  ) => getViewModel(
    searchForArticlesReturningResults(articleIds, 1, O.none),
  );

  const getViewModelWithAdditionalPages = async (
    articleId: ArticleId,
    cursorValue: string,
    itemsPerPage: number,
  ) => getViewModel(
    searchForArticlesReturningResults([articleId], 2, O.some(cursorValue)),
    itemsPerPage,
  );

  const getViewModelForAPageWithNoResults = async () => getViewModel(
    searchForArticlesReturningNoResults,
  );

  describe('and there is only one page of results, with no evaluated articles', () => {
    const articleId = arbitraryArticleId();

    beforeEach(async () => {
      result = await getViewModelForASinglePage([articleId]);
    });

    it('all article cards are included in the view model', () => {
      expect(result.articleCards).toStrictEqual(
        [
          expect.objectContaining({
            articleId,
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
    const articleId = arbitraryArticleId();
    const itemsPerPage = 1;
    const cursorValue = arbitraryWord();

    beforeEach(async () => {
      result = await getViewModelWithAdditionalPages(articleId, cursorValue, itemsPerPage);
    });

    it('no more than itemsPerPage article cards are included in the view model', () => {
      expect(result.articleCards).toStrictEqual(
        [
          expect.objectContaining({
            articleId,
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
      expect(result.articleCards).toStrictEqual([]);
    });

    it('the query is displayed', () => {
      expect(result.query).toBe(query);
    });

    it('the state of the filter for evaluated articles is displayed', () => {
      expect(result.evaluatedOnly).toBe(false);
    });
  });
});
