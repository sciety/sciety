import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel } from '../../../../src/html-pages/search-results-page/construct-view-model/construct-view-model';
import { ArticlesCategoryViewModel, SomeRelatedGroups, ViewModel } from '../../../../src/html-pages/search-results-page/view-model';
import { TestFramework, createTestFramework } from '../../../framework';
import { arbitrarySanitisedHtmlFragment, arbitraryString, arbitraryWord } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryDoi } from '../../../types/doi.helper';
import { arbitraryArticleServer } from '../../../types/article-server.helper';
import { arbitraryGroup } from '../../../types/group.helper';
import { Doi } from '../../../../src/types/doi';
import { arbitraryRecordEvaluationPublicationCommand } from '../../../write-side/commands/record-evaluation-publication-command.helper';
import { arbitraryAddGroupCommand } from '../../../write-side/commands/add-group-command.helper';

describe('construct-view-model', () => {
  let framework: TestFramework;
  let defaultDependencies: TestFramework['dependenciesForViews'];

  beforeEach(() => {
    framework = createTestFramework();
    defaultDependencies = framework.dependenciesForViews;
  });

  describe('when the category is "articles"', () => {
    let result: ViewModel & { category: 'articles' };
    const query = arbitraryString();
    const category = O.some('articles' as const);
    const cursor = O.none;
    const page = O.none;
    const evaluatedOnly = O.none;

    const searchForArticles = (articleId: Doi, total: number, nextCursor: O.Option<string>) => () => () => TE.right({
      items: [
        {
          articleId,
          server: arbitraryArticleServer(),
          title: arbitrarySanitisedHtmlFragment(),
          authors: O.none,
        },
      ],
      total,
      nextCursor,
    });

    const isArticleCategory = (value: ViewModel): value is ViewModel & { category: 'articles' } => value.category === 'articles';
    const getArticleCategoryViewModelForASinglePage = async (articleId: Doi) => pipe(
      {
        query, category, cursor, page, evaluatedOnly,
      },
      constructViewModel(
        {
          ...defaultDependencies,
          searchForArticles: searchForArticles(articleId, 1, O.none),
        },
        1,
      ),
      TE.filterOrElseW(
        isArticleCategory,
        shouldNotBeCalled,
      ),
      TE.getOrElse(shouldNotBeCalled),
    )();

    const getArticleCategoryViewModelWithAdditionalPages = async (
      articleId: Doi,
      cursorValue: string,
      itemsPerPage: number,
    ) => pipe(
      {
        query, category, cursor, page, evaluatedOnly,
      },
      constructViewModel(
        {
          ...defaultDependencies,
          searchForArticles: searchForArticles(articleId, 2, O.some(cursorValue)),
        },
        itemsPerPage,
      ),
      TE.filterOrElseW(
        isArticleCategory,
        shouldNotBeCalled,
      ),
      TE.getOrElse(shouldNotBeCalled),
    )();

    const getArticleCategoryViewModelForAPageWithNoResults = async () => pipe(
      {
        query, category, cursor, page, evaluatedOnly,
      },
      constructViewModel(
        {
          ...defaultDependencies,
          searchForArticles: () => () => TE.right({
            items: [],
            total: 0,
            nextCursor: O.none,
          }),
        },
        1,
      ),
      TE.filterOrElseW(
        isArticleCategory,
        shouldNotBeCalled,
      ),
      TE.getOrElse(shouldNotBeCalled),
    )();

    describe('and there is a page of results, containing evaluated articles', () => {
      const articleId = arbitraryDoi();
      let groupNames: ReadonlyArray<string>;
      const addGroup1Command = arbitraryAddGroupCommand();
      const addGroup2Command = arbitraryAddGroupCommand();
      const isSomeRelatedGroups = (value: ArticlesCategoryViewModel['relatedGroups']): value is SomeRelatedGroups => value.tag === 'some-related-groups';

      const ensureThereAreSomeRelatedGroups = (value: ArticlesCategoryViewModel['relatedGroups']): SomeRelatedGroups => pipe(
        value,
        O.fromPredicate(isSomeRelatedGroups),
        O.getOrElseW(() => { throw new Error(`${value.tag} is not SomeRelatedGroups`); }),
      );

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
        groupNames = pipe(
          await getArticleCategoryViewModelForASinglePage(articleId),
          (viewModel) => viewModel.relatedGroups,
          ensureThereAreSomeRelatedGroups,
          (someRelatedGroups) => someRelatedGroups.items,
          RA.map((item) => item.groupName),
        );
      });

      it.skip('displays the evaluating groups as being related', () => {
        expect(groupNames).toBe([addGroup1Command.name, addGroup2Command.name]);
      });
    });

    describe('and there is only one page of results, with no evaluated articles', () => {
      const articleId = arbitraryDoi();

      beforeEach(async () => {
        result = await getArticleCategoryViewModelForASinglePage(articleId);
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
    });
  });

  describe('when the category is "groups"', () => {
    let result: ViewModel;
    const category = O.some('groups' as const);
    const cursor = O.none;
    const page = O.none;
    const evaluatedOnly = O.none;

    describe('and there are results', () => {
      const group = arbitraryGroup();
      const query = group.name;

      beforeEach(async () => {
        await framework.commandHelpers.deprecatedCreateGroup(group);
        result = await pipe(
          {
            query, category, cursor, page, evaluatedOnly,
          },
          constructViewModel(defaultDependencies, 1),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('all group cards are included in the view model', () => {
        expect(result.itemCardsToDisplay).toStrictEqual(
          [
            expect.objectContaining({
              name: group.name,
            }),
          ],
        );
      });

      it('the groups tab is active', () => {
        expect(result.category).toBe('groups');
      });

      it('the number of groups found is displayed', () => {
        expect(result.availableGroupMatches).toBe(1);
      });

      it('the number of articles found is displayed', () => {
        expect(result.availableArticleMatches).toBe(0);
      });

      it('the query is displayed', () => {
        expect(result.query).toBe(query);
      });
    });

    describe('but there are no results', () => {
      const query = arbitraryString();

      beforeEach(async () => {
        result = await pipe(
          {
            query, category, cursor, page, evaluatedOnly,
          },
          constructViewModel(defaultDependencies, 1),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('there are no group cards included in the view model', () => {
        expect(result.itemCardsToDisplay).toStrictEqual([]);
      });

      it('the number of groups found is displayed', () => {
        expect(result.availableGroupMatches).toBe(0);
      });

      it('the query is displayed', () => {
        expect(result.query).toBe(query);
      });
    });
  });

  describe('when the category is not provided', () => {
    it.todo('the category defaults to articles');
  });
});
