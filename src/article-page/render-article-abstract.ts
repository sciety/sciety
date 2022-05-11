import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type ArticleAbstractViewModel = {
  abstract: HtmlFragment,
};

export const renderArticleAbstract = (articleDetails: ArticleAbstractViewModel): HtmlFragment => pipe(
  `
    <section role="doc-abstract" class="article-abstract">
      ${articleDetails.abstract}
    </section>
  `,
  toHtmlFragment,
);
