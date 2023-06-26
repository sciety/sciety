import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { ArticleErrorCardViewModel, renderArticleErrorCard } from '../../../shared-components/article-card/render-article-error-card';
import { renderArticleCardWithControlsAndOptionalAnnotation } from '../../../shared-components/article-card';
import { Doi } from '../../../types/doi';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { ListId } from '../../../types/list-id';
import { ArticleCardWithControlsViewModel } from '../view-model';

type RenderArticlesList = (
  articleViewModels: ReadonlyArray<E.Either<ArticleErrorCardViewModel, ArticleCardWithControlsViewModel>>,
) => HtmlFragment;

const renderRemoveArticleForm = (articleId: Doi, listId: ListId) => pipe(
  articleId.value,
  (id) => `
    <div class="article-card__controls">
      <form method="post" action="/forms/remove-article-from-list">
        <input type="hidden" name="articleid" value="${id}">
        <input type="hidden" name="listid" value="${listId}">
        <button aria-label="Remove this article from the list" class="saved-articles-control">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" class="saved-articles-control__icon">
            <desc>Remove this article from the list</desc>
            <path d="M0 0h24v24H0V0z" fill="none"/>
            <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/>
          </svg>
        </button>
      </form>
    </div>
  `,
  toHtmlFragment,
);

const renderControls = (viewModel: ArticleCardWithControlsViewModel) => pipe(
  viewModel.hasControls,
  B.fold(
    () => toHtmlFragment(''),
    () => renderRemoveArticleForm(viewModel.articleCard.articleId, viewModel.listId),
  ),
);

export const renderArticlesList: RenderArticlesList = (articles) => pipe(
  articles,
  RA.map(E.fold(
    renderArticleErrorCard,
    (viewModel) => renderArticleCardWithControlsAndOptionalAnnotation(
      viewModel.articleCard,
      renderControls(viewModel),
      viewModel.annotationContent,
    ),
  )),
  RA.map((activity) => `<li>${activity}</li>`),
  (renderedActivities) => `
    <ol class="card-list" role="list">
      ${renderedActivities.join('')}
    </ol>
  `,
  toHtmlFragment,
);
