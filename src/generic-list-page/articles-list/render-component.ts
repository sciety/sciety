import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { flow } from 'fp-ts/function';
import { ArticleErrorCardViewModel, renderArticleErrorCard } from './render-article-error-card';
import { ArticleViewModel, renderArticleCardWithControlsAndOptionalAnnotation } from '../../shared-components/article-card';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

type ArticleCardWithControlsViewModel = {
  articleViewModel: ArticleViewModel,
  controls: O.Option<HtmlFragment>,
};

type RenderArticlesList = (
  articleViewModels: ReadonlyArray<E.Either<ArticleErrorCardViewModel, ArticleCardWithControlsViewModel>>,
) => HtmlFragment;

export const renderComponent: RenderArticlesList = flow(
  RA.map(E.fold(
    renderArticleErrorCard,
    ({ articleViewModel, controls }) => renderArticleCardWithControlsAndOptionalAnnotation(controls)(articleViewModel),
  )),
  RA.map((activity) => `<li class="articles-list__item">${activity}</li>`),
  (renderedActivities) => `
      <ul class="articles-list" role="list">${renderedActivities.join('')}</ul>
  `,
  toHtmlFragment,
);
