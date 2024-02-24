import { renderFeed } from './render-feed.js';
import { renderUserListManagement } from './render-user-list-management.js';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment.js';
import { ViewModel } from '../view-model.js';
import { renderListedIn } from './render-listed-in.js';
import { renderRelatedArticles } from './render-related-articles.js';
import { renderLangAttribute } from '../../../shared-components/lang-attribute/index.js';
import { renderHeader } from './render-header.js';
import { renderRelatedArticlesLink } from './render-related-articles-link.js';
import { renderReviewingGroups } from './render-reviewing-groups.js';

export const renderPage = (viewmodel: ViewModel): HtmlFragment => toHtmlFragment(`
  <div class="article-page-wrapper">
    ${renderHeader(viewmodel)}
    <div class="sciety-grid-two-columns">
      <section class="article-actions">
        ${renderReviewingGroups(viewmodel.reviewingGroups)}
        <a href="${viewmodel.expressionFullTextHref}" class="full-article-button">Read the full article</a>
        ${renderRelatedArticlesLink(viewmodel.relatedArticles)}
        <div class="list-management">
          ${renderListedIn(viewmodel.listedIn)}
          ${renderUserListManagement(viewmodel)}
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
