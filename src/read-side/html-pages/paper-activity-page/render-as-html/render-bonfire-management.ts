import { ExpressionDoi } from '../../../../types/expression-doi';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';

const renderJoinTheDiscussionButton = (expressionDoi: ExpressionDoi): HtmlFragment => (expressionDoi === '10.7554/elife.95814.3' ? toHtmlFragment('') : toHtmlFragment(''));

export const renderBonfireManagement = (
  bonfireSocialLinkHref: string,
  expressionDoi: ExpressionDoi,
): HtmlFragment => toHtmlFragment(
  `
    <section class="bonfire-management">
        <h2 class="article-actions-heading">Discuss this preprint</h2>
            <a href=${bonfireSocialLinkHref} class="bonfire-management-button">Start a discussion</a>
            ${renderJoinTheDiscussionButton(expressionDoi)}
            <a href="https://blog.sciety.org/sciety-secures-funding-from-nlnet-foundation-to-help-build-discourse-around-preprints/">What are Sciety discussions?</a>
    </section>
    `,
);
