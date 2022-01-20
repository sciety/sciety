import { pipe } from 'fp-ts/function';
import { renderAuthors } from './render-authors';
import { ArticleAuthors } from '../../types/article-authors';
import { Doi } from '../../types/doi';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

type ArticleDetails = {
  abstract: HtmlFragment,
  authors: ArticleAuthors,
};

export const renderMetaContent = (articleDetails: ArticleDetails, doi: Doi): HtmlFragment => pipe(
  `
    <div class="article-meta-wrapper">
      <section class="article-meta">
        ${renderAuthors(articleDetails.authors)}
        <ul aria-label="Publication details" class="article-meta-data-list" role="list">
          <li>
            <a href="https://doi.org/${doi.value}" target="_blank">https://doi.org/${doi.value}</a>
          </li>
        </ul>
      </section>

      <section class="article-abstract" role="doc-abstract">
        ${articleDetails.abstract}
      </section>

      <a href="https://doi.org/${doi.value}" class="full-article-button" target="_blank">
        Read the full article
      </a>
    </div>
  `,
  toHtmlFragment,
);
