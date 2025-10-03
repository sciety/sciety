import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';

export const renderBonfireManagement = (): HtmlFragment => toHtmlFragment(
  `
    <section class="bonfire-management">
        <h2 class="article-actions-heading">Discuss this preprint</h2>
            <a href="https://discussions.sciety.org/signup">Start a discussion</a>
    </section>
    `,
);
