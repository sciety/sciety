import * as B from 'fp-ts/boolean';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { ListId } from '../../types/list-id';
import { renderArticleCardContents } from './render-article-card';
import { ViewModel } from './view-model';
import { Doi } from '../../types/doi';

type AnnotationContent = O.Option<HtmlFragment>;

export type ArticleCardWithControlsAndAnnotationViewModel = {
  articleCard: ViewModel,
  hasControls: boolean,
  annotationContent: O.Option<HtmlFragment>,
  listId: ListId,
  articleId: Doi,
};

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

const renderControls = (viewModel: ArticleCardWithControlsAndAnnotationViewModel) => pipe(
  viewModel.hasControls,
  B.fold(
    () => toHtmlFragment(''),
    () => renderRemoveArticleForm(viewModel.articleId, viewModel.listId),
  ),
);

const renderAnnotationContent = (content: AnnotationContent) => pipe(
  content,
  O.match(
    () => '',
    (annotation) => `
      <section class="article-card-annotation">
        <h4 class="visually-hidden">Annotation by AvasthiReading</h4>
        <p>${annotation}</p>
      </section>
    `,
  ),
);

export const renderArticleCardWithControlsAndAnnotation = (viewModel: ArticleCardWithControlsAndAnnotationViewModel): HtmlFragment => toHtmlFragment(`
  <article>
    <section class="article-card">
      ${renderArticleCardContents(viewModel.articleCard)}
      ${renderControls(viewModel)}
    </section>
    ${renderAnnotationContent(viewModel.annotationContent)}
  </article>
`);
