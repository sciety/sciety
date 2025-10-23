import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { inputFieldNames } from '../../../../standards';
import { ExpressionDoi } from '../../../../types/expression-doi';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { ViewModel } from '../view-model';

const renderJoinTheDiscussionButton = (discussionLinkHref: ViewModel['bonfireManagement']['optionalJoinDiscussionLinkHref']) => pipe(
  discussionLinkHref,
  O.match(
    () => '',
    (href) => `<a href="${href}" class="bonfire-management-button">Join the discussion</a>`,
  ),
  toHtmlFragment,
);

const renderStartTheDiscussionButton = (
  startDiscussionLinkHref: string,
  expressionDoi: ExpressionDoi,
  userIsLoggedIn: boolean,
) => {
  if (process.env.EXPERIMENT_ENABLED === 'true' && userIsLoggedIn) {
    return `<form method="post" action="/forms/start-bonfire-discussion">
    <input type="hidden" name="${inputFieldNames.expressionDoi}" value="${expressionDoi}">
    <button aria-label="Start a discussion about this paper on the Sciety Bonfire at discussions.sciety.org" class="bonfire-management-button">
    Start a discussion
    </button>
  </form>
`;
  }
  return `<a href="${startDiscussionLinkHref}" class="bonfire-management-button">Start a discussion</a>`;
};

export const renderBonfireManagement = (
  bonfireManagement: ViewModel['bonfireManagement'],
  userIsLoggedIn: boolean,
): HtmlFragment => toHtmlFragment(
  `
    <section class="bonfire-management">
        <h2 class="article-actions-heading">Discuss this preprint</h2>
            ${renderStartTheDiscussionButton(bonfireManagement.startDiscussionLinkHref, bonfireManagement.expressionDoi, userIsLoggedIn)}
            ${renderJoinTheDiscussionButton(bonfireManagement.optionalJoinDiscussionLinkHref)}
            <a href="https://blog.sciety.org/sciety-secures-funding-from-nlnet-foundation-to-help-build-discourse-around-preprints/">What are Sciety discussions?</a>
    </section>
    `,
);
