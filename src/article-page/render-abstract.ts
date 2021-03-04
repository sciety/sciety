import { Doi } from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export const renderAbstract = (doi: Doi, abstract: HtmlFragment): HtmlFragment => toHtmlFragment(`
  <section class="article-abstract" role="doc-abstract">
    ${abstract}
    <a href="https://doi.org/${doi.value}" class="full-article-button">
      Read the full article
    </a>
  </section>
`);
