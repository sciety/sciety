import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { ListId } from '../../types/list-id';
import { renderArticleCardContents } from '../article-card/render-article-card';
import { ArticleId } from '../../types/article-id';
import { ArticleCardWithControlsAndAnnotationViewModel } from './article-card-with-controls-and-annotation-view-model';

const renderRemoveArticleForm = (articleId: ArticleId, listId: ListId) => pipe(
  articleId.value,
  (id) => `
      <form method="post" action="/forms/remove-article-from-list">
        <input type="hidden" name="articleid" value="${id}">
        <input type="hidden" name="listid" value="${listId}">
        <button aria-label="Remove this article from the list" class="saved-articles-control--remove">
        Remove article
        </button>
      </form>
  `,
  toHtmlFragment,
);

const renderLinkToAnnotationForm = (href: O.Option<string>) => pipe(
  href,
  O.match(
    () => '',
    (h) => `<a href="${h}" class="saved-articles-control--annotate">Add annotation</a>`,
  ),
);

const renderControls = (viewModel: ArticleCardWithControlsAndAnnotationViewModel) => pipe(
  viewModel.controls,
  O.match(
    () => toHtmlFragment(''),
    (controls) => `
    <div class="article-card__controls">
      ${renderLinkToAnnotationForm(controls.createAnnotationFormHref)}
      ${renderRemoveArticleForm(controls.articleId, controls.listId)}
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
          <h4>${htmlEscape(annotation.author)}</h4>
        </header>
        <p>${htmlEscape(annotation.content)}</p>
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
