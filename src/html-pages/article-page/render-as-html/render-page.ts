import { renderAuthors } from './render-authors';
import { renderFeed } from './render-feed';
import { renderSaveArticle } from './render-save-article';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { ViewModel } from '../view-model';
import { renderListedIn } from './render-listed-in';
import { renderRelatedArticles } from './render-related-articles';
import { renderLangAttribute } from '../../../shared-components/lang-attribute';

export const renderPage = (viewmodel: ViewModel): HtmlFragment => toHtmlFragment(`
  <header class="page-header page-header--article">
    <h1${renderLangAttribute(viewmodel.titleLanguageCode)}>${viewmodel.title}</h1>
    ${renderAuthors(viewmodel.authors)}
  </header>
  <section class="article-actions">
    <a href="${viewmodel.fullArticleUrl}" class="full-article-button">Read the full article</a>
    <a href="#relatedArticles" class="see-related-articles-button">See related articles</a>
    <div class="listed-in">
      ${renderListedIn(viewmodel.listedIn)}
      ${renderSaveArticle(viewmodel)}
    </div>
  </section>
  <section role="doc-abstract" class="article-abstract">
    <h2>Abstract</h2>
    <div${renderLangAttribute(viewmodel.abstractLanguageCode)}>${viewmodel.abstract}</div>
  </section>
  <div class="main-content">
    ${renderFeed(viewmodel.feedItemsByDateDescending)}
  </div>
  ${renderRelatedArticles(viewmodel)}
`);
