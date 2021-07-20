import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ArticleActivity } from '../../types/article-activity';
import * as DE from '../../types/data-error';

// ts-unused-exports:disable-next-line
export type PageOfArticles = {
  content: ReadonlyArray<ArticleActivity>,
  nextPageNumber: O.Option<number>,
  articleCount: number,
};

const emptyPage = E.right({
  content: [],
  nextPageNumber: O.none,
  articleCount: 0,
});

type SelectedPage = (
  allEvaluatedArticles: ReadonlyArray<ArticleActivity>,
  page: number,
  pageSize: number,
) => E.Either<DE.DataError, PageOfArticles>;

const selectedPage: SelectedPage = (allEvaluatedArticles, page, pageSize) => pipe(
  allEvaluatedArticles,
  RA.chunksOf(pageSize),
  RA.lookup(page - 1),
  E.fromOption(() => DE.notFound),
  E.map((content) => ({
    content,
    nextPageNumber: pipe(
      page + 1,
      O.some,
      O.filter((nextPage) => nextPage <= Math.ceil(allEvaluatedArticles.length / pageSize)),
    ),
    articleCount: allEvaluatedArticles.length,
  })),
);

export const paginate = (
  page: number,
  pageSize: number,
) => (allEvaluatedArticles: ReadonlyArray<ArticleActivity>): E.Either<DE.DataError, PageOfArticles> => (
  (allEvaluatedArticles.length === 0)
    ? emptyPage
    : selectedPage(allEvaluatedArticles, page, pageSize)
);
