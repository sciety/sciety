import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { renderAuthors } from './render-card-authors';
import { ViewModel } from './view-model';
import { renderCurationStatements } from './render-curation-statements';
import { renderReviewingGroupsWithLink } from './render-reviewing-groups-with-link';
import { renderMeta } from './render-meta';

export const renderArticleCardContents = (model: ViewModel): HtmlFragment => toHtmlFragment(`
  <h3 class="article-card__title"><a href="${model.paperActivityPageHref}">${model.title}</a></h3>
  ${renderAuthors(model.authors)}
  ${renderCurationStatements(model.curationStatementsTeasers)}
  ${renderReviewingGroupsWithLink(model.reviewingGroups)}
  <footer class="article-card__footer">
    ${renderMeta(model)}
  </footer>
`);

export const renderAsHtml = (model: ViewModel): HtmlFragment => toHtmlFragment(`
  <section class="article-card">
    ${renderArticleCardContents(model)}
  </section>
`);
