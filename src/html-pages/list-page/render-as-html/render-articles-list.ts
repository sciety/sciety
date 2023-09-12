import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import {
  ArticleErrorCardViewModel, renderArticleErrorCard,
  ArticleCardWithControlsAndAnnotationViewModel,
  renderArticleCardWithControlsAndAnnotation,
} from '../../../shared-components/article-card';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { renderListItems } from '../../../shared-components/render-list-items';

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
    renderArticleCardWithControlsAndAnnotation,
  )),
  (listItems) => renderListItems(listItems),
  (list) => `<ol class="article-list" role="list">${list}</ol>`,
  toHtmlFragment,
);
