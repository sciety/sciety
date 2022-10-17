import { renderAuthors } from './render-authors';
import { ViewModel } from './view-model';
import { langAttributeFor } from '../shared-components/lang-attribute-for';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export const renderPage = (viewmodel: ViewModel): HtmlFragment => toHtmlFragment(`
  <header class="page-header page-header--article">
    <h1${langAttributeFor(viewmodel.title)}>${viewmodel.title}</h1>
    ${renderAuthors(viewmodel.authors)}
  </header>
  <div class="article-actions">
    ${viewmodel.articleActions.fullArticleLink}
    ${viewmodel.articleActions.saveArticle}
  </div>
  <section role="doc-abstract" class="article-abstract">
    <h2>Abstract</h2>
    <div${langAttributeFor(viewmodel.articleAbstract)}>${viewmodel.articleAbstract}</div>
  </section>
  <div class="main-content">
    ${viewmodel.mainContent}
  </div>
`);
