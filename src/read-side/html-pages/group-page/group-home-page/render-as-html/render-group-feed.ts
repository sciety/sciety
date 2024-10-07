import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../../../types/html-fragment';
import { renderArticleCardStack } from '../../../shared-components/article-card-stack';
import { PaginationControlsViewModel, renderPaginationControls } from '../../../shared-components/pagination';
import { ViewModel } from '../view-model';

const wrapIntoSection = (paginationControlsViewModel: PaginationControlsViewModel) => (
  feedContent: HtmlFragment,
) => toHtmlFragment(`
  <section class="group-page-feed">
    <h2>Latest preprint reviews</h2>
    ${feedContent}
    ${renderPaginationControls(paginationControlsViewModel)}
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
    wrapIntoSection(content),
  );
};
