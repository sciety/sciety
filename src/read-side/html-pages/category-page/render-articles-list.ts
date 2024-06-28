import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import {
  ArticleCardViewModel,
  ArticleErrorCardViewModel, renderArticleCard, renderArticleErrorCard,
} from '../shared-components/article-card';
import { renderArticleList } from '../shared-components/article-list';
import { renderListItems } from '../shared-components/list-items';

type RenderArticlesList = (
  articleViewModels: ReadonlyArray<E.Either<
  ArticleErrorCardViewModel,
  ArticleCardViewModel
  >>,
) => HtmlFragment;

export const renderArticlesList: RenderArticlesList = (articles) => pipe(
  articles,
  RA.map(E.fold(
    renderArticleErrorCard,
    (articleCard) => renderArticleCard(articleCard),
  )),
  (listItems) => renderListItems(listItems),
  (list) => renderArticleList(list),
  toHtmlFragment,
);
