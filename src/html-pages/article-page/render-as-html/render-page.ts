import { renderAuthors } from './render-authors';
import { renderFeed } from './render-feed';
import { renderSaveArticle } from './render-save-article';
import { langAttributeFor } from '../../../shared-components/lang-attribute-for';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { ViewModel } from '../view-model';
import { renderListedIn } from './render-listed-in';

export const renderPage = (viewmodel: ViewModel): HtmlFragment => toHtmlFragment(`
  <header class="page-header page-header--article">
    <h1${langAttributeFor(viewmodel.title)}>${viewmodel.title}</h1>
    ${renderAuthors(viewmodel.authors)}
  </header>
  <div class="article-actions">
    <a href="${viewmodel.fullArticleUrl}" class="full-article-button">Read the full article</a>
    ${renderSaveArticle(viewmodel)}
    ${renderListedIn(viewmodel.listedIn)}
  </div>
  <section role="doc-abstract" class="article-abstract">
    <h2>Abstract</h2>
    <div${langAttributeFor(viewmodel.abstract)}>${viewmodel.abstract}</div>
  </section>
  <div class="main-content">
    ${renderFeed(viewmodel.feedItemsByDateDescending)}
  </div>
`);
