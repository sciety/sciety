import { pipe } from 'fp-ts/function';
import { detect } from 'tinyld';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type ArticleAbstractViewModel = {
  abstract: HtmlFragment,
};

const langAttributeFor = (articleAbstract: string): string => {
  const code = detect(articleAbstract, { only: ['en', 'es', 'pt'] });
  return code === '' ? '' : ` lang="${code}"`;
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
