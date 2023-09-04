import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { renderFeed } from './render-feed';
import { renderSaveArticle } from './render-save-article';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { ViewModel } from '../view-model';
import { renderListedIn } from './render-listed-in';
import { renderRelatedArticles } from './render-related-articles';
import { renderLangAttribute } from '../../../shared-components/lang-attribute';
import { renderHeader } from './render-header';
import { renderRelatedArticlesLink } from './render-related-articles-link';
import { templateListItems } from '../../../shared-components/list-items';

const renderReviewingGroups = (reviewingGroups: ViewModel['reviewingGroups']) => {
  if (process.env.EXPERIMENT_ENABLED === 'true') {
    if (reviewingGroups.length === 0) {
      return toHtmlFragment('');
    }
    return pipe(
      reviewingGroups,
      RA.map(toHtmlFragment),
      (listItems) => templateListItems(listItems),
      (listItems) => `
        <section>
          <h2 class="article-actions-heading">Reviewed by</h2>
          <ul role="list" class="article-actions-reviewing-groups">
            ${listItems}
          </ul>
        </section>
      `,
      toHtmlFragment,
    );
  }
  return '';
};

export const renderPage = (viewmodel: ViewModel): HtmlFragment => toHtmlFragment(`
  <div class="article-page-wrapper">
    ${renderHeader(viewmodel)}
    <div class="sciety-grid-two-columns">
      <section class="article-actions">
        ${renderReviewingGroups(viewmodel.reviewingGroups)}
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
