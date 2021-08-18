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

const renderLists = (evaluatedArticlesListCard: HtmlFragment) => `
  <section class="group-page-lists">
    <h2 class="group-page-lists-heading">
      Lists
    </h2>
    ${evaluatedArticlesListCard}
  </section>
`;

const renderAbout = (followers: HtmlFragment, description: HtmlFragment) => `
  <section class="group-page-followers">
    ${followers}
  </section>
  <div class="group-page-description">
    ${description}
  </div>
`;

const render = (components: Components) => `
  <div class="page-content__background">
    <div class="sciety-grid sciety-grid--one-column">
      ${components.header}
      <div class="group-page-follow-toggle">
        ${components.followButton}
      </div>
      ${renderLists(components.evaluatedArticlesListCard)}
      ${renderAbout(components.followers, components.description)}      
    </div>
  </div>
`;

export const renderErrorPage = (): RenderPageError => ({
  type: DE.unavailable,
  message: toHtmlFragment('We couldn\'t retrieve this information. Please try again.'),
});

export const renderPage = (group: Group) => (components: Components): Page => ({
  title: group.name,
  content: pipe(components, render, toHtmlFragment),
});
