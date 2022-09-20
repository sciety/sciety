import { pipe } from 'fp-ts/function';
import { langAttributeFor } from '../shared-components/lang-attribute-for';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type ArticleAbstractViewModel = {
  abstract: HtmlFragment,
};

export const renderArticleAbstract = (articleDetails: ArticleAbstractViewModel): HtmlFragment => pipe(
  `
    <section role="doc-abstract" class="article-abstract">
      <h2>Abstract</h2>
      <div${langAttributeFor(articleDetails.abstract)}>${articleDetails.abstract}</div>
    </section>
  `,
  toHtmlFragment,
);
