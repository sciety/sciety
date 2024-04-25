import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { ViewModel } from './view-model';
import { safelyRenderRawUserInput } from '../../../../shared-components/raw-user-input-renderers';
import { ExpressionDoi } from '../../../../types/expression-doi';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { ListId } from '../../../../types/list-id';
import { renderArticleCardContents } from '../paper-activity-summary-card/render-as-html';

const renderRemoveArticleForm = (expressionDoi: ExpressionDoi, listId: ListId) => toHtmlFragment(`
  <form method="post" action="/forms/remove-article-from-list">
    <input type="hidden" name="articleid" value="${expressionDoi}">
    <input type="hidden" name="listid" value="${listId}">
    <button aria-label="Remove this article from the list" class="saved-articles-control--remove">
    Remove article
    </button>
  </form>
`);

const renderLinkToAnnotationForm = (href: O.Option<string>) => pipe(
  href,
  O.match(
    () => '',
    (h) => `<a href="${h}" class="saved-articles-control--annotate">Add comment</a>`,
  ),
);

const renderControls = (viewModel: ViewModel) => pipe(
  viewModel.controls,
  O.match(
    () => toHtmlFragment(''),
    (controls) => `
    <div class="article-card__controls">
      ${renderLinkToAnnotationForm(controls.createAnnotationFormHref)}
      ${renderRemoveArticleForm(controls.expressionDoi, controls.listId)}
    </div>
    `,
  ),
);

const renderAnnotation = (viewModel: ViewModel['annotation']) => pipe(
  viewModel,
  O.match(
    () => '',
    (annotation) => `
      <section class="article-card-annotation">
        <header class="article-card-annotation__header">
          <img class="article-card-annotation__avatar" src="${annotation.authorAvatarSrc}" alt="">
          <h4>${htmlEscape(annotation.author)}</h4>
        </header>
        <p>${safelyRenderRawUserInput(annotation.content)}</p>
      </section>
    `,
  ),
);

export const renderAsHtml = (viewModel: ViewModel): HtmlFragment => toHtmlFragment(`
  <article class="article-card article-card--with-annotation">
    <div class="article-card-content">
      ${renderArticleCardContents(viewModel.articleCard)}
      ${renderControls(viewModel)}
    </div>
    ${renderAnnotation(viewModel.annotation)}
  </article>
`);
