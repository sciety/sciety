import { pipe } from 'fp-ts/function';
import { renderAuthors } from './render-authors';
import { tabs } from '../../shared-components/tabs';
import { ArticleAuthors } from '../../types/article-authors';
import { Doi } from '../../types/doi';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { renderPage } from '../render-page';
import { tabList } from '../tab-list';

type ArticleDetails = {
  abstract: HtmlFragment,
  authors: ArticleAuthors,
};

const renderMetaContent = (articleDetails: ArticleDetails, doi: Doi) => pipe(
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

export const renderMetaPage = (components: {
  doi: Doi,
  header: HtmlFragment,
  articleDetails: ArticleDetails,
}): HtmlFragment => pipe(
  renderMetaContent(components.articleDetails, components.doi),
  tabs({
    tabList: tabList(components.doi),
    activeTabIndex: 0,
  }),
  renderPage(components.header),
);
