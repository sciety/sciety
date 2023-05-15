import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { renderAuthors } from './render-authors';
import { renderFeed } from './render-feed';
import { renderSaveArticle } from './render-save-article';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { ViewModel } from '../view-model';
import { renderListedIn } from './render-listed-in';
import { renderRelatedArticles } from './render-related-articles';
import { LanguageCode } from '../construct-view-model/detect-language';

const renderLangAttribute = (code: O.Option<LanguageCode>) => pipe(
  code,
  O.match(
    () => '',
    (lc) => ` lang="${lc}"`,
  ),
);

export const renderPage = (viewmodel: ViewModel): HtmlFragment => toHtmlFragment(`
  <header class="page-header page-header--article">
    <h1${renderLangAttribute(viewmodel.titleLanguageCode)}>${viewmodel.title}</h1>
    ${renderAuthors(viewmodel.authors)}
  </header>
  <div class="article-actions">
    <a href="${viewmodel.fullArticleUrl}" class="full-article-button">Read the full article</a>
    ${renderSaveArticle(viewmodel)}
    ${renderListedIn(viewmodel.listedIn)}
  </div>
  <section role="doc-abstract" class="article-abstract">
    <h2>Abstract</h2>
    <div${renderLangAttribute(viewmodel.abstractLanguageCode)}>${viewmodel.abstract}</div>
  </section>
  <div class="main-content">
    ${renderFeed(viewmodel.feedItemsByDateDescending)}
  </div>
  ${renderRelatedArticles(viewmodel)}
`);
