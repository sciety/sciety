import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { renderAuthors } from '../render-card-authors';
import { ArticleCardViewModel } from './view-model';
import { renderCurationStatements } from './render-curation-statements';
import { renderReviewingGroupsWithLink } from './render-reviewing-groups-with-link';
import { renderMeta } from './render-meta';

export const renderArticleCardContents = (model: ArticleCardViewModel): HtmlFragment => toHtmlFragment(`
  <h3 class="article-card__title"><a href="${model.articleLink}">${model.title}</a></h3>
  ${renderAuthors(model.authors)}
  ${renderCurationStatements(model.curationStatementsTeasers)}
  ${renderReviewingGroupsWithLink(model.reviewingGroups)}
  <footer class="article-card__footer">
    ${renderMeta(model)}
  </footer>
`);

export const renderArticleCard = (model: ArticleCardViewModel): HtmlFragment => toHtmlFragment(`
  <section class="article-card">
    ${renderArticleCardContents(model)}
  </section>
`);
