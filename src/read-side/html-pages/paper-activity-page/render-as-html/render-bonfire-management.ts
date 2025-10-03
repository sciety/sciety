import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';

export const renderBonfireManagement = (bonfireSocialLinkHref: string): HtmlFragment => toHtmlFragment(
  `
    <section class="bonfire-management">
        <h2 class="article-actions-heading">Discuss this preprint</h2>
            <a href=${bonfireSocialLinkHref} class="bonfire-management-button">Start a discussion</a>
            <a href="https://blog.sciety.org/sciety-secures-funding-from-nlnet-foundation-to-help-build-discourse-around-preprints/">What are Sciety discussions?</a>
    </section>
    `,
);
