import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import {
  ArticleCardWithControlsAndAnnotationViewModel, renderArticleCardWithControlsAndAnnotation,
} from '../../shared-components/article-card-with-controls-and-annotation';
import { renderArticleList } from '../../shared-components/article-list';
import { renderListItems } from '../../shared-components/list-items';
import {
  PaperActivityErrorCardViewModel, renderPaperActivityErrorCard,
} from '../../shared-components/paper-activity-summary-card';

type RenderArticlesList = (
  articleViewModels: ReadonlyArray<E.Either<
  PaperActivityErrorCardViewModel,
  ArticleCardWithControlsAndAnnotationViewModel
  >>,
) => HtmlFragment;

export const renderArticlesList: RenderArticlesList = (articles) => pipe(
  articles,
  RA.map(E.fold(
    renderPaperActivityErrorCard,
    (articleCard) => renderArticleCardWithControlsAndAnnotation(articleCard),
  )),
  (listItems) => renderListItems(listItems),
  (list) => renderArticleList(list),
  toHtmlFragment,
);
