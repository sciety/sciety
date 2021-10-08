import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { paginate as selectedPage } from '../../sciety-feed-page/paginate';
import { ArticleActivity } from '../../types/article-activity';
import * as DE from '../../types/data-error';

export type PageOfArticles = {
  content: ReadonlyArray<ArticleActivity>,
  nextPageNumber: O.Option<number>,
  currentPageNumber: number,
  articleCount: number,
  pageSize: number,
  numberOfPages: number,
};

const emptyPage = (page: number, pageSize: number) => E.right({
  content: [],
  nextPageNumber: O.none,
  currentPageNumber: page,
  articleCount: 0,
  pageSize,
  numberOfPages: 0,
});

type Paginate = (
  page: number,
  pageSize: number,
) => (
  allEvaluatedArticles: ReadonlyArray<ArticleActivity>,
) => E.Either<DE.DataError, PageOfArticles>;

export const paginate: Paginate = (page, pageSize) => (allEvaluatedArticles) => (
  (allEvaluatedArticles.length === 0)
    ? emptyPage(page, pageSize)
    : pipe(
      allEvaluatedArticles,
      selectedPage(pageSize, page),
      E.map((foo) => ({
        content: foo.items,
        nextPageNumber: foo.nextPage,
        currentPageNumber: foo.pageNumber,
        articleCount: foo.numberOfOriginalItems,
        pageSize,
        numberOfPages: foo.numberOfPages,
      })),
    )
);
