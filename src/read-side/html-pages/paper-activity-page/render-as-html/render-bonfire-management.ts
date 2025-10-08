import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { eqExpressionDoi, ExpressionDoi, fromValidatedString } from '../../../../types/expression-doi';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';

const isAppropriateDoi = (
  expressionDoi: ExpressionDoi,
) => (doiToBeChecked: ExpressionDoi): boolean => eqExpressionDoi.equals(doiToBeChecked, expressionDoi);

const renderJoinTheDiscussionButton = (expressionDoi: ExpressionDoi, discussionLinkHref: string) => pipe(
  expressionDoi,
  O.fromPredicate(isAppropriateDoi(fromValidatedString('10.7554/elife.95814.3'))),
  O.match(
    () => '',
    () => `<a href="${discussionLinkHref}" class="bonfire-management-button">Join the discussion</a>`,
  ),
  toHtmlFragment,
);

export const renderBonfireManagement = (
  bonfireSocialLinkHref: string,
  expressionDoi: ExpressionDoi,
): HtmlFragment => toHtmlFragment(
  `
    <section class="bonfire-management">
        <h2 class="article-actions-heading">Discuss this preprint</h2>
            <a href=${bonfireSocialLinkHref} class="bonfire-management-button">Start a discussion</a>
            ${renderJoinTheDiscussionButton(expressionDoi, 'https://discussions.sciety.org/post/01K6MQC5NZFYEHXYQ23VCK047B')}
            <a href="https://blog.sciety.org/sciety-secures-funding-from-nlnet-foundation-to-help-build-discourse-around-preprints/">What are Sciety discussions?</a>
    </section>
    `,
);
