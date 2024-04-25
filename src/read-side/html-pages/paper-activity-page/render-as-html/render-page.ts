import { renderFeed } from './render-feed';
import { renderHeader } from './render-header';
import { renderListedIn } from './render-listed-in';
import { renderRelatedArticles } from './render-related-articles';
import { renderRelatedArticlesLink } from './render-related-articles-link';
import { renderReviewingGroups } from './render-reviewing-groups';
import { renderUserListManagement } from './render-user-list-management';
import { renderLangAttribute } from '../../../../shared-components/lang-attribute';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { ViewModel } from '../view-model';

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
