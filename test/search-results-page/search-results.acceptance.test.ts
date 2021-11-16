import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { searchResultsPage } from '../../src/search-results-page';
import * as DE from '../../src/types/data-error';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { Page } from '../../src/types/page';
import { RenderPageError } from '../../src/types/render-page-error';
import { sanitise } from '../../src/types/sanitised-html-fragment';
import { arbitraryNumber, arbitraryString, arbitraryWord } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryGroup } from '../types/group.helper';

const pageSize = arbitraryNumber(5, 10);

const dummyAdapters = {
  findGroups: () => T.of([]),
  searchEuropePmc: () => () => TE.right({
    items: [],
    total: 0,
    nextCursor: O.none,
  }),
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
      cursor: O.none,
      page: O.none,
    };

    it('displays the query inside the search form', async () => {
      const page = pipe(
        params,
        searchResultsPage(dummyAdapters)(pageSize),
      );
      const rendered = await contentOf(page)();
      const value = rendered.querySelector('#searchText')?.getAttribute('value');

      expect(value).toBe(query);
    });

    it('displays the number of matching articles', async () => {
      const page = pipe(
        params,
        searchResultsPage(dummyAdapters)(pageSize),
      );
      const rendered = await contentOf(page)();
      const tabHtml = rendered.querySelector('.tab--active')?.innerHTML;

      expect(tabHtml).toContain('Articles (0');
    });

    it('displays the number of matching groups', async () => {
      const page = pipe(
        params,
        searchResultsPage(dummyAdapters)(pageSize),
      );
      const rendered = await contentOf(page)();
      const tabHtml = rendered.querySelector('.tab:not(.tab--active)')?.innerHTML;

      expect(tabHtml).toContain('Groups (0');
    });

    describe('with no category provided', () => {
      it('defaults to "articles" category', async () => {
        const page = pipe(
          {
            query: arbitraryString(),
            category: O.none,
            cursor: O.none,
            page: O.none,
          },
          searchResultsPage(dummyAdapters)(pageSize),
        );
        const rendered = await contentOf(page)();
        const tabHeading = rendered.querySelector('.tab--active')?.innerHTML;

        expect(tabHeading).toContain('Articles');
      });
    });

    describe('when there are results', () => {
      describe('with "articles" as category', () => {
        const arbitraryArticleItem = () => ({
          doi: arbitraryDoi(),
          server: 'biorxiv' as const,
          title: pipe(arbitraryString(), toHtmlFragment, sanitise),
          authors: O.some([arbitraryString()]),
        });

        it('displays the first n articles if more than n matching articles', async () => {
          const n = 2;
          const page = pipe(
            {
              query: arbitraryString(),
              category: O.some('articles' as const),
              cursor: O.none,
              page: O.none,
            },
            searchResultsPage({
              ...dummyAdapters,
              searchEuropePmc: () => () => TE.right({
                items: [
                  arbitraryArticleItem(),
                  arbitraryArticleItem(),
                ],
                total: 3,
                nextCursor: O.some(arbitraryWord()),
              }),
              findReviewsForArticleDoi: () => TE.right([]),
              findVersionsForArticleDoi: () => TO.none,
            })(n),
          );
          const rendered = await contentOf(page)();
          const articleCards = rendered.querySelectorAll('.article-card');

          expect(articleCards).toHaveLength(n);
        });

        it('displays page number on first page', async () => {
          const page = pipe(
            {
              query: arbitraryString(),
              category: O.some('articles' as const),
              cursor: O.none,
              page: O.none,
            },
            searchResultsPage({
              ...dummyAdapters,
              searchEuropePmc: () => () => TE.right({
                items: [
                  arbitraryArticleItem(),
                ],
                total: arbitraryNumber(2, 50),
                nextCursor: O.some(arbitraryWord()),
              }),
              findReviewsForArticleDoi: () => TE.right([]),
              findVersionsForArticleDoi: () => TO.none,
            })(1),
          );
          const rendered = await contentOf(page)();
          const pageCount = rendered.querySelector('.search-results__page_count')?.textContent;

          expect(pageCount).toContain(' 1 of ');
        });

        it('displays page number on second page', async () => {
          const pageNumber = arbitraryNumber(2, 10);
          const page = pipe(
            {
              query: arbitraryString(),
              category: O.some('articles' as const),
              cursor: O.some(arbitraryString()),
              page: O.some(pageNumber),
            },
            searchResultsPage({
              ...dummyAdapters,
              searchEuropePmc: () => () => TE.right({
                items: [
                  arbitraryArticleItem(),
                ],
                total: arbitraryNumber(2, 50),
                nextCursor: O.some(arbitraryWord()),
              }),
              findReviewsForArticleDoi: () => TE.right([]),
              findVersionsForArticleDoi: () => TO.none,
            })(1),
          );
          const rendered = await contentOf(page)();
          const pageCount = rendered.querySelector('.search-results__page_count')?.textContent;

          expect(pageCount).toContain(` ${pageNumber} of `);
        });

        it('displays total number of pages', async () => {
          const page = pipe(
            {
              query: arbitraryString(),
              category: O.some('articles' as const),
              cursor: O.none,
              page: O.none,
            },
            searchResultsPage({
              ...dummyAdapters,
              searchEuropePmc: () => () => TE.right({
                items: [
                  arbitraryArticleItem(),
                  arbitraryArticleItem(),
                  arbitraryArticleItem(),
                ],
                total: 4,
                nextCursor: O.some(arbitraryWord()),
              }),
              findReviewsForArticleDoi: () => TE.right([]),
              findVersionsForArticleDoi: () => TO.none,
            })(3),
          );
          const rendered = await contentOf(page)();
          const pageCount = rendered.querySelector('.search-results__page_count')?.textContent;

          expect(pageCount).toContain(' of 2');
        });

        it('displays the next link if there are more than n matching articles', async () => {
          const n = 2;
          const page = pipe(
            {
              query: arbitraryString(),
              category: O.some('articles' as const),
              cursor: O.none,
              page: O.none,
            },
            searchResultsPage({
              ...dummyAdapters,
              searchEuropePmc: () => () => TE.right({
                items: [
                  arbitraryArticleItem(),
                  arbitraryArticleItem(),
                  arbitraryArticleItem(),
                ],
                total: 3,
                nextCursor: O.some(arbitraryWord()),
              }),
              findReviewsForArticleDoi: () => TE.right([]),
              findVersionsForArticleDoi: () => TO.none,
            })(n),
          );
          const rendered = await contentOf(page)();
          const nextLink = rendered.querySelector('.pagination-controls__next_link');

          expect(nextLink).not.toBeNull();
        });

        it('next link contains the next page number as a query param', async () => {
          const page = pipe(
            {
              query: arbitraryString(),
              category: O.some('articles' as const),
              cursor: O.none,
              page: O.none,
            },
            searchResultsPage({
              ...dummyAdapters,
              searchEuropePmc: () => () => TE.right({
                items: [arbitraryArticleItem()],
                total: arbitraryNumber(5, 10),
                nextCursor: O.some(arbitraryWord()),
              }),
              findReviewsForArticleDoi: () => TE.right([]),
              findVersionsForArticleDoi: () => TO.none,
            })(1),
          );
          const rendered = await contentOf(page)();
          const nextLinkHref = rendered.querySelector('.pagination-controls__next_link')?.getAttribute('href');

          expect(nextLinkHref).toContain('page=2');
        });

        it('passes the cursor to searchEuropePmc', async () => {
          const n = 2;
          const searchEuropePmcMock = jest.fn();
          const cursor = O.some(arbitraryString());
          const page = pipe(
            {
              query,
              category: O.some('articles' as const),
              cursor,
              page: O.none,
            },
            searchResultsPage({
              ...dummyAdapters,
              searchEuropePmc: () => searchEuropePmcMock.mockImplementation(() => TE.right({
                items: [
                  arbitraryArticleItem(),
                ],
                total: 3,
                nextCursor: O.some(arbitraryWord()),
              })),
              findReviewsForArticleDoi: () => TE.right([]),
              findVersionsForArticleDoi: () => TO.none,
            })(n),
          );
          await contentOf(page)();

          expect(searchEuropePmcMock).toHaveBeenCalledWith(query, cursor);
        });

        it('only displays article results', async () => {
          const page = pipe(
            {
              query: arbitraryString(),
              category: O.some('articles' as const),
              cursor: O.none,
              page: O.none,
            },
            searchResultsPage({
              ...dummyAdapters,
              findGroups: () => T.of([arbitraryGroupId()]),
            })(pageSize),
          );
          const rendered = await contentOf(page)();
          const groupCards = rendered.querySelectorAll('.group-card');

          expect(groupCards).toHaveLength(0);
        });

        it('displays "Articles" as the active tab', async () => {
          const page = pipe(
            {
              query: arbitraryString(),
              category: O.some('articles' as const),
              cursor: O.none,
              page: O.none,
            },
            searchResultsPage({
              ...dummyAdapters,
              findGroups: () => T.of([arbitraryGroupId()]),
            })(pageSize),
          );
          const rendered = await contentOf(page)();
          const tabHtml = rendered.querySelector('.tab--active')?.innerHTML;

          expect(tabHtml).toContain('Articles');
        });

        it('displays "Groups" as a link tab', async () => {
          const page = pipe(
            {
              query: arbitraryString(),
              category: O.some('articles' as const),
              cursor: O.none,
              page: O.none,
            },
            searchResultsPage({
              ...dummyAdapters,
              findGroups: () => T.of([arbitraryGroupId()]),
            })(pageSize),
          );
          const rendered = await contentOf(page)();
          const tabHtml = rendered.querySelector('.tab:not(.tab--active)')?.innerHTML;

          expect(tabHtml).toContain('Groups');
        });

        describe('when extra details of an article cannot be fetched', () => {
          it('display the article without extra details', async () => {
            const page = pipe(
              {
                query: arbitraryString(),
                category: O.some('articles' as const),
                cursor: O.none,
                page: O.none,
              },
              searchResultsPage({
                ...dummyAdapters,
                searchEuropePmc: () => () => TE.right({
                  items: [arbitraryArticleItem()],
                  total: 1,
                  nextCursor: O.none,
                }),
                findReviewsForArticleDoi: () => TE.right([]),
                findVersionsForArticleDoi: () => TO.none,
              })(pageSize),
            );
            const rendered = await contentOf(page)();
            const articleCard = rendered.querySelectorAll('.article-card')[0];

            expect(articleCard).not.toContain('Latest version');
          });
        });

        describe('when the search for all articles fails', () => {
          it('currently displays an error page instead of the page', async () => {
            const page = await pipe(
              {
                query: arbitraryString(),
                category: O.some('articles' as const),
                cursor: O.none,
                page: O.none,
              },
              searchResultsPage({
                ...dummyAdapters,
                searchEuropePmc: () => () => TE.left(DE.unavailable),
              })(pageSize),
            )();

            expect(page).toStrictEqual(E.left(expect.objectContaining({
              message: "We're having trouble accessing search right now, please try again later.",
            })));
          });

          it.todo('displays the article tab with an error message');

          it.todo('links to the Groups tab');
        });
      });

      describe('with "groups" as category', () => {
        it('displays all matching groups regardless of limit on articles', async () => {
          const n = 2;
          const matchedGroups = [
            arbitraryGroupId(),
            arbitraryGroupId(),
            arbitraryGroupId(),
          ];
          const page = pipe(
            {
              query: arbitraryString(),
              category: O.some('groups' as const),
              cursor: O.none,
              page: O.none,
            },
            searchResultsPage({
              ...dummyAdapters,
              findGroups: () => T.of(matchedGroups),
              getGroup: () => TE.right(arbitraryGroup()),
              getAllEvents: T.of([]),
            })(n),
          );
          const rendered = await contentOf(page)();
          const groupCards = rendered.querySelectorAll('.group-card');

          expect(groupCards).toHaveLength(matchedGroups.length);
        });

        it('doesnt display page count', async () => {
          const page = pipe(
            {
              query: arbitraryString(),
              category: O.some('groups' as const),
              cursor: O.none,
              page: O.none,
            },
            searchResultsPage({
              ...dummyAdapters,
              findGroups: () => T.of([arbitraryGroupId()]),
              getGroup: () => TE.right(arbitraryGroup()),
              getAllEvents: T.of([]),
            })(1),
          );
          const rendered = await contentOf(page)();
          const pageCount = rendered.querySelector('.search-results__page_count');

          expect(pageCount).toBeNull();
        });

        it('only displays groups results', async () => {
          const page = pipe(
            {
              query: arbitraryString(),
              category: O.some('groups' as const),
              cursor: O.none,
              page: O.none,
            },
            searchResultsPage(dummyAdapters)(pageSize),
          );
          const rendered = await contentOf(page)();
          const articleCards = rendered.querySelectorAll('.article-card');

          expect(articleCards).toHaveLength(0);
        });

        it('displays "Groups" as the active tab', async () => {
          const page = pipe(
            {
              query: arbitraryString(),
              category: O.some('groups' as const),
              cursor: O.none,
              page: O.none,
            },
            searchResultsPage(dummyAdapters)(pageSize),
          );
          const rendered = await contentOf(page)();
          const tabHtml = rendered.querySelector('.tab--active')?.innerHTML;

          expect(tabHtml).toContain('Groups');
        });

        it('displays "Articles" as a link tab', async () => {
          const page = pipe(
            {
              query: arbitraryString(),
              category: O.some('groups' as const),
              cursor: O.none,
              page: O.none,
            },
            searchResultsPage(dummyAdapters)(pageSize),
          );
          const rendered = await contentOf(page)();
          const tabHtml = rendered.querySelector('.tab:not(.tab--active)')?.innerHTML;

          expect(tabHtml).toContain('Articles');
        });
      });
    });

    describe('when there are no results', () => {
      describe('with "articles" as category', () => {
        it('displays no result cards', async () => {
          const page = pipe(
            {
              query: arbitraryString(),
              category: O.some('groups' as const),
              cursor: O.none,
              page: O.none,
            },
            searchResultsPage(dummyAdapters)(pageSize),
          );
          const rendered = await contentOf(page)();
          const articleCards = rendered.querySelectorAll('.article-card');

          expect(articleCards).toHaveLength(0);
        });
      });

      describe('with "groups" as category', () => {
        it('displays no result cards', async () => {
          const page = pipe(
            {
              query: arbitraryString(),
              category: O.some('groups' as const),
              cursor: O.none,
              page: O.none,
            },
            searchResultsPage(dummyAdapters)(pageSize),
          );
          const rendered = await contentOf(page)();
          const groupCards = rendered.querySelectorAll('.group-card');

          expect(groupCards).toHaveLength(0);
        });
      });
    });
  });
});
