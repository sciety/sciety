import * as B from 'fp-ts/boolean';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { ListId } from '../../types/list-id';
import { renderArticleCardContents } from '../article-card/render-article-card';
import { Doi } from '../../types/doi';
import { ArticleCardWithControlsAndAnnotationViewModel } from './article-card-with-controls-and-annotation-view-model';

const renderRemoveArticleForm = (articleId: Doi, listId: ListId) => pipe(
  articleId.value,
  (id) => `
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
  `,
  toHtmlFragment,
);

const renderLinkToAnnotationForm = (href: string) => {
  if (process.env.EXPERIMENT_ENABLED === 'true') {
    return `<a href="${href}">Add annotation</a>`;
  }
  return '';
};

const renderControls = (viewModel: ArticleCardWithControlsAndAnnotationViewModel) => pipe(
  viewModel.hasControls,
  B.fold(
    () => toHtmlFragment(''),
    () => `
    <div class="article-card__controls">
      ${renderRemoveArticleForm(viewModel.articleId, viewModel.listId)}
      ${renderLinkToAnnotationForm(`/annotations/create-annotation-form-avasthi-reading?articleId=${viewModel.articleId.value}&listId=${viewModel.listId}`)}
    </div>
    `,
  ),
);

const renderAnnotationContent = (viewModel: ArticleCardWithControlsAndAnnotationViewModel['annotation']) => pipe(
  viewModel,
  O.match(
    () => '',
    (annotation) => `
      <section class="article-card-annotation">
        <header class="article-card-annotation__header">
          <img class="article-card-annotation__avatar" src="${annotation.authorAvatarPath}" alt="">
          <h4>${annotation.author}</h4>
        </header>
        <p>${annotation.content}</p>
      </section>
    `,
  ),
);

export const renderArticleCardWithControlsAndAnnotation = (viewModel: ArticleCardWithControlsAndAnnotationViewModel): HtmlFragment => toHtmlFragment(`
  <article class="article-card article-card--with-annotation">
    <div class="article-card-content">
      ${renderArticleCardContents(viewModel.articleCard)}
      ${renderControls(viewModel)}
    </div>
    ${renderAnnotationContent(viewModel.annotation)}
  </article>
`);
