import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Ports, toPageOfCards } from './to-page-of-cards';
import { paginate } from '../../shared-components/paginate';
import { ArticleActivity } from '../../types/article-activity';
import * as DE from '../../types/data-error';
import { Group } from '../../types/group';
import { HtmlFragment } from '../../types/html-fragment';

export { Ports } from './to-page-of-cards';

type EvaluatedArticlesList = (
  ports: Ports,
  group: Group,
  pageNumber: number,
  pageSize: number
) => (
  articles: ReadonlyArray<ArticleActivity>,
) => TE.TaskEither<DE.DataError, HtmlFragment>;

const emptyPage = (pageNumber: number) => E.right({
  items: [],
  nextPage: O.none,
  pageNumber,
  numberOfOriginalItems: 0,
  numberOfPages: 0,
});

export const evaluatedArticlesList: EvaluatedArticlesList = (ports, group, pageNumber, pageSize) => (articles) => pipe(
  articles,
  RA.match(
    () => emptyPage(pageNumber),
    paginate(pageSize, pageNumber),
  ),
  TE.fromEither,
  TE.chainTaskK(toPageOfCards(ports, group)),
);
