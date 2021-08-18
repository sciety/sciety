import { pipe } from 'fp-ts/function';
import * as DE from '../types/data-error';
import { Group } from '../types/group';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

type Components = {
  header: HtmlFragment,
  description: HtmlFragment,
  evaluatedArticlesListCard: HtmlFragment,
  followers: HtmlFragment,
  followButton: HtmlFragment,
};

const render = (components: Components) => `
  <div class="page-content__background">
    <div class="sciety-grid sciety-grid--one-column">
      ${components.header}
      <div class="group-page-follow-toggle">
        ${components.followButton}
      </div>
      <section class="group-page-lists">
        <h2 class="group-page-lists-heading">
          Lists
        </h2>
        ${components.evaluatedArticlesListCard}
      </section>
      <section class="group-page-followers">
        ${components.followers}
      </section>
      <div class="group-page-description">
        ${components.description}
      </div>
    </div>
  </div>
`;

export const oldRenderErrorPage = (): RenderPageError => ({
  type: DE.unavailable,
  message: toHtmlFragment('We couldn\'t retrieve this information. Please try again.'),
});

export const oldRenderPage = (group: Group) => (components: Components): Page => ({
  title: group.name,
  content: pipe(components, render, toHtmlFragment),
});
