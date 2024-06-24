import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import {
  ArticleErrorCardViewModel, renderArticleErrorCard,
} from '../../shared-components/article-card';
import {
  ArticleCardWithControlsAndAnnotationViewModel, renderArticleCardWithControlsAndAnnotation,
} from '../../shared-components/article-card-with-controls-and-annotation';
import { renderArticleList } from '../../shared-components/article-list';
import { renderListItems } from '../../shared-components/list-items';

type RenderArticlesList = (
  articleViewModels: ReadonlyArray<E.Either<
  ArticleErrorCardViewModel,
  ArticleCardWithControlsAndAnnotationViewModel
  >>,
) => HtmlFragment;

export const renderArticlesList: RenderArticlesList = (articles) => pipe(
  articles,
  RA.map(E.fold(
    renderArticleErrorCard,
    (articleCard) => renderArticleCardWithControlsAndAnnotation(articleCard),
  )),
  (listItems) => renderListItems(listItems),
  (list) => renderArticleList(list),
  toHtmlFragment,
);
