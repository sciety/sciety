import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { PageOfItems, paginate as selectedPage } from '../../sciety-feed-page/paginate';
import { ArticleActivity } from '../../types/article-activity';
import * as DE from '../../types/data-error';

export type PageOfArticles = PageOfItems<ArticleActivity>;

const emptyPage = (page: number) => E.right({
  items: [],
  nextPage: O.none,
  pageNumber: page,
  numberOfOriginalItems: 0,
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
    ? emptyPage(page)
    : pipe(
      allEvaluatedArticles,
      selectedPage(pageSize, page),
    )
);
