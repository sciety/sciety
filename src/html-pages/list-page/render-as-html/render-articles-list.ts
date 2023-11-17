import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import {
  ArticleErrorCardViewModel, renderArticleErrorCard,
} from '../../../shared-components/article-card/index.js';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment.js';
import { renderListItems } from '../../../shared-components/render-list-items.js';
import {
  ArticleCardWithControlsAndAnnotationViewModel, renderArticleCardWithControlsAndAnnotation,
} from '../../../shared-components/article-card-with-controls-and-annotation/index.js';

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
  (list) => `<ol class="article-list" role="list">${list}</ol>`,
  toHtmlFragment,
);
