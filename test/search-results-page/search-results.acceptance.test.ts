import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { searchResultsPage } from '../../src/search-results-page';
import { Page } from '../../src/types/page';
import { RenderPageError } from '../../src/types/render-page-error';
import { arbitraryString } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryGroupId } from '../types/group-id.helper';

const dummyAdapters = {
  findGroups: shouldNotBeCalled,
  searchEuropePmc: shouldNotBeCalled,
  findReviewsForArticleDoi: shouldNotBeCalled,
  findVersionsForArticleDoi: shouldNotBeCalled,
  getAllEvents: shouldNotBeCalled,
  getGroup: () => shouldNotBeCalled,
};

const contentOf = (page: TE.TaskEither<RenderPageError, Page>) => pipe(
  page,
  TE.match(
    (errorPage) => errorPage.message,
    (p) => p.content,
  ),
  T.map(JSDOM.fragment),
);

describe('search-results-page acceptance', () => {
  describe('given a query', () => {
    const query = arbitraryString();
    const params = {
      query,
      category: O.none,
    };

    it('displays the query inside the search form', async () => {
      const page = pipe(
        params,
        searchResultsPage({
          ...dummyAdapters,
          findGroups: () => T.of([]),
          searchEuropePmc: () => TE.right({ items: [], total: 0 }),
        }),
      );
      const rendered = await contentOf(page)();
      const value = rendered.querySelector('#searchText')?.getAttribute('value');

      expect(value).toBe(query);
    });

    it('displays the number of matching articles', async () => {
      const page = pipe(
        params,
        searchResultsPage({
          ...dummyAdapters,
          findGroups: () => T.of([]),
          searchEuropePmc: () => TE.right({ items: [], total: 0 }),
        }),
      );
      const rendered = await contentOf(page)();
      const tabHtml = rendered.querySelector('.search-results-tab--heading')?.innerHTML;

      expect(tabHtml).toContain('Articles (0');
    });

    it('displays the number of matching groups', async () => {
      const page = pipe(
        params,
        searchResultsPage({
          ...dummyAdapters,
          findGroups: () => T.of([]),
          searchEuropePmc: () => TE.right({ items: [], total: 0 }),
        }),
      );
      const rendered = await contentOf(page)();
      const tabHtml = rendered.querySelector('.search-results-tab--link')?.innerHTML;

      expect(tabHtml).toContain('Groups (0');
    });

    describe('with no category provided', () => {
      it('defaults to "articles" category', async () => {
        const page = pipe(
          { query: arbitraryString(), category: O.none },
          searchResultsPage({
            ...dummyAdapters,
            findGroups: () => T.of([]),
            searchEuropePmc: () => TE.right({ items: [], total: 0 }),
          }),
        );
        const rendered = await contentOf(page)();
        const tabHeading = rendered.querySelector('.search-results-tab--heading')?.innerHTML;

        expect(tabHeading).toContain('Articles');
      });
    });

    describe('when there are results', () => {
      it.todo('displays a maximum of ten results');

      describe('with "articles" as category', () => {
        it('only displays article results', async () => {
          const page = pipe(
            { query: arbitraryString(), category: O.some('articles') },
            searchResultsPage({
              ...dummyAdapters,
              findGroups: () => T.of([arbitraryGroupId()]),
              searchEuropePmc: () => TE.right({ items: [], total: 0 }),
            }),
          );
          const rendered = await contentOf(page)();
          const groupCards = rendered.querySelectorAll('.group-card');

          expect(groupCards).toHaveLength(0);
        });

        it.todo('displays "Articles" as the active tab');

        it.todo('displays "Groups" as a link tab');

        describe('when extra details of an article cannot be fetched', () => {
          it.todo('display the article without extra details');
        });

        describe('when the search for all articles fails', () => {
          it.todo('display an error message');
        });
      });

      describe('with "groups" as category', () => {
        it.todo('only displays groups results');

        it.todo('displays "Groups" as the active tab');

        it.todo('displays "Articles" as a link tab');

        describe('when details of a group cannot be fetched', () => {
          it.todo('only displays the successfully fetched groups');
        });

        describe('when details of all groups cannot be fetched', () => {
          it.todo('display no result cards');
        });
      });
    });

    describe('when there are no results', () => {
      it.todo('displays no result cards');
    });
  });
});
