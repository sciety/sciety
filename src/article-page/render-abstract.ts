import { Doi } from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export const renderAbstract = (doi: Doi, abstract: HtmlFragment): HtmlFragment => toHtmlFragment(`
  <section class="article-abstract" role="doc-abstract">
    <h3>
      Abstract
    </h3>
      ${abstract}
      <a href="https://doi.org/${doi.value}" class="article-call-to-action-link">
        Read the full article
      </a>
  </section>
`);
