import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment.js';
import { renderAuthors } from './render-card-authors.js';
import { ViewModel } from './view-model.js';
import { renderCurationStatements } from './render-curation-statements.js';
import { renderReviewingGroupsWithLink } from './render-reviewing-groups-with-link.js';
import { renderMeta } from './render-meta.js';

export const renderArticleCardContents = (model: ViewModel): HtmlFragment => toHtmlFragment(`
  <h3 class="article-card__title"><a href="${model.articleHref}">${model.title}</a></h3>
  ${renderAuthors(model.authors)}
  ${renderCurationStatements(model.curationStatementsTeasers)}
  ${renderReviewingGroupsWithLink(model.reviewingGroups)}
  <footer class="article-card__footer">
    ${renderMeta(model)}
  </footer>
`);

export const renderArticleCard = (model: ViewModel): HtmlFragment => toHtmlFragment(`
  <section class="article-card">
    ${renderArticleCardContents(model)}
  </section>
`);
