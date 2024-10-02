import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { HtmlFragment } from '../../../../types/html-fragment';
import {
  ArticleCardViewModel, ArticleErrorCardViewModel, renderArticleCard, renderArticleErrorCard,
} from '../article-card';
import { renderArticleList } from '../article-list';
import { renderListItems } from '../list-items';

export const renderArticleCardStack = (
  cards: ReadonlyArray<E.Either<ArticleErrorCardViewModel, ArticleCardViewModel>>,
): HtmlFragment => pipe(
  cards,
  RA.map(E.fold(
    renderArticleErrorCard,
    renderArticleCard,
  )),
  (items) => renderListItems(items),
  renderArticleList,
);
