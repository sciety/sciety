import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { searchResultsPage } from '../../src/search-results-page';
import { arbitraryString } from '../helpers';

describe('search-results-page acceptance', () => {
  describe('given a query', () => {
    it('displays the query inside the search form', async () => {
      const query = arbitraryString();
      const params = {
        query,
        category: O.none,
      };
      const ports = {
        findGroups: () => T.of([]),
        searchEuropePmc: () => TE.right({ items: [], total: 0 }),
        findReviewsForArticleDoi: () => T.of([]),
        findVersionsForArticleDoi: () => TO.none,
        getAllEvents: T.of([]),
        getGroup: () => TO.none,
      };
      const rendered = await pipe(
        params,
        searchResultsPage(ports),
        TE.match(
          (errorPage) => errorPage.message,
          (page) => page.content,
        ),
        T.map(JSDOM.fragment),
      )();

      const value = rendered.querySelector('#searchText')?.getAttribute('value');

      expect(value).toBe(query);
    });

    it('displays the number of matching articles', async () => {
      const query = arbitraryString();
      const params = {
        query,
        category: O.none,
      };
      const ports = {
        findGroups: () => T.of([]),
        searchEuropePmc: () => TE.right({ items: [], total: 0 }),
        findReviewsForArticleDoi: () => T.of([]),
        findVersionsForArticleDoi: () => TO.none,
        getAllEvents: T.of([]),
        getGroup: () => TO.none,
      };
      const rendered = await pipe(
        params,
        searchResultsPage(ports),
        TE.match(
          (errorPage) => errorPage.message,
          (page) => page.content,
        ),
        T.map(JSDOM.fragment),
      )();

      const value = rendered.querySelector('.search-results-tab--heading')?.innerHTML;

      expect(value).toContain('Articles (0');
    });

    it.todo('displays the number of matching groups');

    describe('with no category provided', () => {
      it.todo('defaults to "articles" category');
    });

    describe('when there are results', () => {
      it.todo('displays a maximum of ten results');

      describe('with "articles" as category', () => {
        it.todo('only displays article results');

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
