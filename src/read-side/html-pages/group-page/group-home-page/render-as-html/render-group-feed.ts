import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../../../types/html-fragment';
import { renderArticleCardStack } from '../../../shared-components/article-card-stack';
import { renderPaginationControls } from '../../../shared-components/pagination';
import { ViewModel } from '../view-model';

const wrapIntoSection = (
  feedContent: HtmlFragment,
) => toHtmlFragment(`
  <section class="group-page-feed">
    <h2>Latest preprint reviews</h2>
    ${feedContent}
  </section>
`);

type RenderGroupFeed = (
  content: ViewModel['feed'],
)
=> HtmlFragment;

export const renderGroupFeed: RenderGroupFeed = (content) => {
  if (content.tag === 'no-activity-yet') {
    return toHtmlFragment('<p class="static-message">This group has no activity yet.</p>');
  }
  return pipe(
    content.articleCards,
    renderArticleCardStack,
    wrapIntoSection,
    (feed) => `
      ${feed}
      ${renderPaginationControls(content)}
    `,
    toHtmlFragment,
  );
};
