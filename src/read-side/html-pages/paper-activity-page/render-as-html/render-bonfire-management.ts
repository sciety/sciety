import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';

export const renderBonfireManagement = (bonfireSocialLinkHref: string): HtmlFragment => toHtmlFragment(
  `
    <section class="bonfire-management">
        <h2 class="article-actions-heading">Discuss this preprint</h2>
            <a href=${bonfireSocialLinkHref}>Start a discussion</a>
    </section>
    `,
);
