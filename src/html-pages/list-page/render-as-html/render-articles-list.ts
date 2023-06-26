import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ArticleErrorCardViewModel, renderArticleErrorCard } from '../../../shared-components/article-card/render-article-error-card';
import {
  ArticleCardWithControlsAndOptionalAnnotationViewModel,
  renderArticleCardWithControlsAndOptionalAnnotation,
} from '../../../shared-components/article-card';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';

type RenderArticlesList = (
  articleViewModels: ReadonlyArray<E.Either<
  ArticleErrorCardViewModel,
  ArticleCardWithControlsAndOptionalAnnotationViewModel
  >>,
) => HtmlFragment;

export const renderArticlesList: RenderArticlesList = (articles) => pipe(
  articles,
  RA.map(E.fold(
    renderArticleErrorCard,
    renderArticleCardWithControlsAndOptionalAnnotation,
  )),
  RA.map((activity) => `<li>${activity}</li>`),
  (renderedActivities) => `
    <ol class="card-list" role="list">
      ${renderedActivities.join('')}
    </ol>
  `,
  toHtmlFragment,
);
