import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { tabs } from '../../shared-components/tabs';
import { ArticleServer } from '../../types/article-server';
import { Doi } from '../../types/doi';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { tabList } from '../tab-list';

// TODO: title should be HtmlFragment and sanitized outside of here
type ArticleDetails = {
  title: string,
  abstract: HtmlFragment,
  authors: O.Option<ReadonlyArray<string>>,
  server: ArticleServer,
};

const renderAuthors = (authors: O.Option<ReadonlyArray<string>>): string => pipe(
  authors,
  O.getOrElse<ReadonlyArray<string>>(() => []),
  RA.map((author) => `<li>${author}</li>`),
  (listItems) => listItems.join(''),
);

export const renderMetaPage = (components: {
  articleDetails: ArticleDetails,
  doi: Doi,
  saveArticle: HtmlFragment,
  tweetThis: HtmlFragment,
}): HtmlFragment => pipe(
  `
      <section class="article-meta">
        <ol aria-label="Authors of this article" class="article-author-list" role="list">
          ${renderAuthors(components.articleDetails.authors)}
        </ol>
        <ul aria-label="Publication details" class="article-meta-data-list" role="list">
          <li>
            <a href="https://doi.org/${components.doi.value}" target="_blank">https://doi.org/${components.doi.value}</a>
          </li>
        </ul>
      </section>

      <section class="article-abstract" role="doc-abstract">
        ${components.articleDetails.abstract}
      </section>

      <a href="https://doi.org/${components.doi.value}" class="full-article-button" target="_blank">
        Read the full article
      </a>
  `,
  toHtmlFragment,
  tabs({
    tabList: tabList(components.doi),
    activeTabIndex: 0,
  }),
  (mainContent) => toHtmlFragment(`
    <header class="page-header page-header--article">
      <h1>${components.articleDetails.title}</h1>
      <div class="article-actions">
        ${components.tweetThis}
        ${components.saveArticle}
      </div>
    </header>

    <div class="main-content main-content--meta">
      ${mainContent}
    </div>
  `),
);
