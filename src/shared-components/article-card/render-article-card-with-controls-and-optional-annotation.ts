import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { ListId } from '../../types/list-id';
import { ArticleCardViewModel, renderArticleCardContents } from './render-article-card';

type AnnotationContent = O.Option<HtmlFragment>;

export type ArticleCardWithControlsAndOptionalAnnotationViewModel = {
  articleCard: ArticleCardViewModel,
  hasControls: boolean,
  annotationContent: O.Option<HtmlFragment>,
  listId: ListId,
};

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

export const renderArticleCardWithControlsAndOptionalAnnotation = (model: ArticleCardViewModel, controls: HtmlFragment, annotationContent: AnnotationContent): HtmlFragment => toHtmlFragment(`
  <article>
    <section class="article-card">
      ${renderArticleCardContents(model)}
      ${controls}
    </section>
    ${renderAnnotationContent(annotationContent)}
  </article>
`);
