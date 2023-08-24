import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { SearchForArticles } from '../../../../src/shared-ports/search-for-articles';
import { constructViewModel } from '../../../../src/html-pages/search-results-page/construct-view-model/construct-view-model';
import { ArticlesCategoryViewModel, SomeRelatedGroups, ViewModel } from '../../../../src/html-pages/search-results-page/view-model';
import { TestFramework, createTestFramework } from '../../../framework';
import { arbitrarySanitisedHtmlFragment, arbitraryString, arbitraryWord } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryDoi } from '../../../types/doi.helper';
import { arbitraryArticleServer } from '../../../types/article-server.helper';
import { Doi } from '../../../../src/types/doi';
import { arbitraryRecordEvaluationPublicationCommand } from '../../../write-side/commands/record-evaluation-publication-command.helper';
import { arbitraryAddGroupCommand } from '../../../write-side/commands/add-group-command.helper';

describe('construct-related-groups', () => {
  let framework: TestFramework;
  let defaultDependencies: TestFramework['dependenciesForViews'];

  beforeEach(() => {
    framework = createTestFramework();
    defaultDependencies = framework.dependenciesForViews;
  });

  describe('when the category is "articles"', () => {
    let result: ViewModel & { category: 'articles' };
    const isSomeRelatedGroups = (value: ArticlesCategoryViewModel['relatedGroups']): value is SomeRelatedGroups => value.tag === 'some-related-groups';

    const ensureThereAreSomeRelatedGroups = (value: ArticlesCategoryViewModel['relatedGroups']): SomeRelatedGroups => pipe(
      value,
      O.fromPredicate(isSomeRelatedGroups),
      O.getOrElseW(() => { throw new Error(`${value.tag} is not SomeRelatedGroups`); }),
    );
    const query = arbitraryString();
    const category = O.some('articles' as const);
    const cursor = O.none;
    const page = O.none;
    const evaluatedOnly = O.none;

    const searchForArticlesReturningResults = (
      articleIds: ReadonlyArray<Doi>,
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

    const isArticleCategory = (value: ViewModel): value is ViewModel & { category: 'articles' } => value.category === 'articles';
    const getArticleCategoryViewModel = async (searchForArticles: SearchForArticles, itemsPerPage: number = 1) => pipe(
      {
        query, category, cursor, page, evaluatedOnly,
      },
      constructViewModel(
        {
          ...defaultDependencies,
          searchForArticles,
        },
        itemsPerPage,
      ),
      TE.filterOrElseW(
        isArticleCategory,
        shouldNotBeCalled,
      ),
      TE.getOrElse(shouldNotBeCalled),
    )();

    const getArticleCategoryViewModelForASinglePage = async (
      articleIds: ReadonlyArray<Doi>,
    ) => getArticleCategoryViewModel(
      searchForArticlesReturningResults(articleIds, 1, O.none),
    );

    const getArticleCategoryViewModelWithAdditionalPages = async (
      articleId: Doi,
      cursorValue: string,
      itemsPerPage: number,
    ) => getArticleCategoryViewModel(
      searchForArticlesReturningResults([articleId], 2, O.some(cursorValue)),
      itemsPerPage,
    );

    const getArticleCategoryViewModelForAPageWithNoResults = async () => getArticleCategoryViewModel(
      searchForArticlesReturningNoResults,
    );

    const findNamesOfRelatedGroups = async (articleIds: ReadonlyArray<Doi>) => pipe(
      await getArticleCategoryViewModelForASinglePage(articleIds),
      (viewModel) => viewModel.relatedGroups,
      ensureThereAreSomeRelatedGroups,
      (someRelatedGroups) => someRelatedGroups.items,
      RA.map((item) => item.groupName),
    );

    describe('and there is a page of results, containing an evaluated article, evaluated once by two different groups', () => {
      const articleId = arbitraryDoi();
      let groupNames: ReadonlyArray<string>;
      const addGroup1Command = arbitraryAddGroupCommand();
      const addGroup2Command = arbitraryAddGroupCommand();

      beforeEach(async () => {
        await framework.commandHelpers.addGroup(addGroup1Command);
        await framework.commandHelpers.addGroup(addGroup2Command);
        await framework.commandHelpers.recordEvaluationPublication({
          ...arbitraryRecordEvaluationPublicationCommand(),
          articleId,
          groupId: addGroup1Command.groupId,
        });
        await framework.commandHelpers.recordEvaluationPublication({
          ...arbitraryRecordEvaluationPublicationCommand(),
          articleId,
          groupId: addGroup2Command.groupId,
        });
        groupNames = await findNamesOfRelatedGroups([articleId]);
      });

      it('displays the evaluating groups as being related', () => {
        expect(groupNames).toStrictEqual([addGroup1Command.name, addGroup2Command.name]);
      });
    });

    describe('and there is a page of results, containing two evaluated articles, each evaluated once by the same group', () => {
      const articleId1 = arbitraryDoi();
      const articleId2 = arbitraryDoi();
      let groupNames: ReadonlyArray<string>;
      const addGroup1Command = arbitraryAddGroupCommand();

      beforeEach(async () => {
        await framework.commandHelpers.addGroup(addGroup1Command);
        await framework.commandHelpers.recordEvaluationPublication({
          ...arbitraryRecordEvaluationPublicationCommand(),
          articleId: articleId1,
          groupId: addGroup1Command.groupId,
        });
        await framework.commandHelpers.recordEvaluationPublication({
          ...arbitraryRecordEvaluationPublicationCommand(),
          articleId: articleId2,
          groupId: addGroup1Command.groupId,
        });
        groupNames = await findNamesOfRelatedGroups([articleId1, articleId2]);
      });

      it('displays the evaluating group once as being related', () => {
        expect(groupNames).toStrictEqual([addGroup1Command.name]);
      });
    });

    describe('and there is a page of results, containing an evaluated article, evaluated twice by the same group', () => {
      const articleId = arbitraryDoi();
      let groupNames: ReadonlyArray<string>;
      const addGroup1Command = arbitraryAddGroupCommand();

      beforeEach(async () => {
        await framework.commandHelpers.addGroup(addGroup1Command);
        await framework.commandHelpers.recordEvaluationPublication({
          ...arbitraryRecordEvaluationPublicationCommand(),
          articleId,
          groupId: addGroup1Command.groupId,
        });
        await framework.commandHelpers.recordEvaluationPublication({
          ...arbitraryRecordEvaluationPublicationCommand(),
          articleId,
          groupId: addGroup1Command.groupId,
        });
        groupNames = await findNamesOfRelatedGroups([articleId]);
      });

      it('displays the evaluating group once as being related', () => {
        expect(groupNames).toStrictEqual([addGroup1Command.name]);
      });
    });

    describe('and there is only one page of results, with no evaluated articles', () => {
      const articleId = arbitraryDoi();

      beforeEach(async () => {
        result = await getArticleCategoryViewModelForASinglePage([articleId]);
      });

      it('all article cards are included in the view model', () => {
        expect(result.itemCardsToDisplay).toStrictEqual(
          [
            expect.objectContaining({
              articleId,
            }),
          ],
        );
      });

      it('the articles tab is active', () => {
        expect(result.category).toBe('articles');
      });

      it('the number of articles found is displayed', () => {
        expect(result.availableArticleMatches).toBe(1);
      });

      it('the number of groups found is displayed', () => {
        expect(result.availableGroupMatches).toBe(0);
      });

      it('the query is displayed', () => {
        expect(result.query).toBe(query);
      });

      it('the state of the filter for evaluated articles is displayed', () => {
        expect(result.evaluatedOnly).toBe(false);
      });

      it('no related groups are displayed', () => {
        expect(result.relatedGroups.tag).toBe('no-groups-evaluated-the-found-articles');
      });
    });

    describe('and there is more than one page of results, with no evaluated articles', () => {
      const articleId = arbitraryDoi();
      const itemsPerPage = 1;
      const cursorValue = arbitraryWord();

      beforeEach(async () => {
        result = await getArticleCategoryViewModelWithAdditionalPages(articleId, cursorValue, itemsPerPage);
      });

      it('no more than itemsPerPage article cards are included in the view model', () => {
        expect(result.itemCardsToDisplay).toStrictEqual(
          [
            expect.objectContaining({
              articleId,
            }),
          ],
        );
      });

      it('the articles tab is active', () => {
        expect(result.category).toBe('articles');
      });

      it('the number of articles found is displayed', () => {
        expect(result.availableArticleMatches).toBe(2);
      });

      it('the number of groups found is displayed', () => {
        expect(result.availableGroupMatches).toBe(0);
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

      it('no related groups are displayed', () => {
        expect(result.relatedGroups.tag).toBe('no-groups-evaluated-the-found-articles');
      });
    });

    describe('but there are no results', () => {
      beforeEach(async () => {
        result = await getArticleCategoryViewModelForAPageWithNoResults();
      });

      it('there are no article cards included in the view model', () => {
        expect(result.itemCardsToDisplay).toStrictEqual([]);
      });

      it('the number of articles found is displayed', () => {
        expect(result.availableArticleMatches).toBe(0);
      });

      it('the query is displayed', () => {
        expect(result.query).toBe(query);
      });

      it('the state of the filter for evaluated articles is displayed', () => {
        expect(result.evaluatedOnly).toBe(false);
      });

      it('no related groups are displayed', () => {
        expect(result.relatedGroups.tag).toBe('no-groups-evaluated-the-found-articles');
      });
    });
  });
});
