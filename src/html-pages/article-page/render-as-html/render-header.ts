import { ViewModel } from '../view-model.js';
import { renderLangAttribute } from '../../../shared-components/lang-attribute/index.js';
import { renderAuthors } from './render-authors.js';
import { renderCurationStatements } from './render-curation-statements.js';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment.js';

export const renderHeader = (viewmodel: ViewModel): HtmlFragment => toHtmlFragment(`
  <div class="article-page-header-wrapper ${(viewmodel.curationStatements.length > 0) ? 'article-page-header-wrapper--with-curation-statements' : ''}">
    <header class="page-header page-header--article">
      <h1${renderLangAttribute(viewmodel.titleLanguageCode)}>${viewmodel.title}</h1>
      ${renderAuthors(viewmodel.authors)}
      ${renderCurationStatements(viewmodel.curationStatements)}
    </header>
  </div>
`);
