import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel, Ports } from '../../../../src/html-pages/search-results-page/construct-view-model/construct-view-model';
import { ViewModel } from '../../../../src/html-pages/search-results-page/view-model';
import { TestFramework, createTestFramework } from '../../../framework';
import { arbitrarySanitisedHtmlFragment, arbitraryString } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryDoi } from '../../../types/doi.helper';
import { arbitraryArticleServer } from '../../../types/article-server.helper';
import { arbitraryGroup } from '../../../types/group.helper';

describe('construct-view-model', () => {
  let framework: TestFramework;
  let defaultAdapters: Ports;
  let result: ViewModel;

  beforeEach(() => {
    framework = createTestFramework();
    defaultAdapters = {
      ...framework.queries,
      ...framework.happyPathThirdParties,
      getAllEvents: framework.getAllEvents,
    };
  });

  describe('when the category is "articles"', () => {
    const query = arbitraryString();
    const category = O.some('articles' as const);
    const cursor = O.none;
    const page = O.none;
    const evaluatedOnly = O.none;

    describe('and there are results', () => {
      const articleId = arbitraryDoi();

      beforeEach(async () => {
        result = await pipe(
          {
            query, category, cursor, page, evaluatedOnly,
          },
          constructViewModel(
            {
              ...defaultAdapters,
              searchForArticles: () => () => TE.right({
                items: [
                  {
                    articleId,
                    server: arbitraryArticleServer(),
                    title: arbitrarySanitisedHtmlFragment(),
                    authors: O.none,
                  },
                ],
                total: 1,
                nextCursor: O.none,
              }),
            },
            1,
          ),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('article cards are included in the view model', () => {
        expect(result.itemsToDisplay).toStrictEqual(
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
    });

    describe('but there are no results', () => {
      beforeEach(async () => {
        result = await pipe(
          {
            query, category, cursor, page, evaluatedOnly,
          },
          constructViewModel(
            {
              ...defaultAdapters,
              searchForArticles: () => () => TE.right({
                items: [],
                total: 0,
                nextCursor: O.none,
              }),
            },
            1,
          ),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('there are no article cards included in the view model', () => {
        expect(result.itemsToDisplay).toStrictEqual([]);
      });

      it('the number of articles found is displayed', () => {
        expect(result.availableArticleMatches).toBe(0);
      });
    });
  });

  describe('when the category is "groups"', () => {
    const category = O.some('groups' as const);
    const cursor = O.none;
    const page = O.none;
    const evaluatedOnly = O.none;

    describe('and there are results', () => {
      const group = arbitraryGroup();
      const query = group.name;

      beforeEach(async () => {
        await framework.commandHelpers.createGroup(group);
        result = await pipe(
          {
            query, category, cursor, page, evaluatedOnly,
          },
          constructViewModel(defaultAdapters, 1),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('group cards are included in the view model', () => {
        expect(result.itemsToDisplay).toStrictEqual(
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
    });

    describe('but there are no results', () => {
      const query = arbitraryString();

      beforeEach(async () => {
        result = await pipe(
          {
            query, category, cursor, page, evaluatedOnly,
          },
          constructViewModel(defaultAdapters, 1),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('there are no group cards included in the view model', () => {
        expect(result.itemsToDisplay).toStrictEqual([]);
      });

      it('the number of groups found is displayed', () => {
        expect(result.availableGroupMatches).toBe(0);
      });
    });
  });

  describe('when the category is not provided', () => {
    it.todo('the category defaults to articles');
  });
});
