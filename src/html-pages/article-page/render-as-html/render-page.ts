import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { ArticleViewModel } from '../../../shared-components/article-card';
import { renderAuthors } from './render-authors';
import { renderFeed } from './render-feed';
import { renderSaveArticle } from './render-save-article';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { ViewModel } from '../view-model';
import { renderListedIn } from './render-listed-in';
import { renderRelatedArticles } from './render-related-articles';
import { renderLangAttribute } from '../../../shared-components/lang-attribute';
import { renderCurationStatements } from './render-curation-statements';

const renderRelatedArticlesLink = (relatedArticles: O.Option<ReadonlyArray<ArticleViewModel>>) => pipe(
  relatedArticles,
  O.match(
    () => '',
    () => `
      <a href="#relatedArticles" class="see-related-articles-button">See related articles</a>
    `,
  ),
);

const renderHeader = (viewmodel: ViewModel) => `
  <div class="article-page-header-wrapper ${(viewmodel.curationStatements.length > 0) ? 'article-page-header-wrapper--with-curation-statements' : ''}">
    <header class="page-header page-header--article">
      <h1${renderLangAttribute(viewmodel.titleLanguageCode)}>${viewmodel.title}</h1>
      ${renderAuthors(viewmodel.authors)}
      ${renderCurationStatements(viewmodel)}
    </header>
  </div>
`;

export const renderPage = (viewmodel: ViewModel): HtmlFragment => toHtmlFragment(`
  <div class="article-page-wrapper">
    ${renderHeader(viewmodel)}
    <div class="sciety-grid-two-columns">
      <section class="article-actions">
        <a href="${viewmodel.fullArticleUrl}" class="full-article-button">Read the full article</a>
        ${renderRelatedArticlesLink(viewmodel.relatedArticles)}
        <div class="list-management">
          ${renderListedIn(viewmodel.listedIn)}
          ${renderSaveArticle(viewmodel)}
        </div>
      </section>
      <section>
        <section role="doc-abstract" class="article-abstract">
          <h2>Abstract</h2>
          <div${renderLangAttribute(viewmodel.abstractLanguageCode)}>${viewmodel.abstract}</div>
        </section>
        ${renderFeed(viewmodel.feedItemsByDateDescending)}
        ${renderRelatedArticles(viewmodel)}
      </section>
    </div>
  </div>
`);
