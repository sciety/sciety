import { pipe } from 'fp-ts/function';
import { Group } from '../types/group';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

type Components = {
  header: HtmlFragment,
  description: HtmlFragment,
  feed: string,
  followers: HtmlFragment,
  followButton: HtmlFragment,
};

const render = (components: Components) => `
  <div class="sciety-grid sciety-grid--group">
    ${components.header}
    <div class="group-page-description">
    ${components.description}
    </div>
    <div class="group-page-side-bar">
      ${components.followers}
      <section>
        <h2>
          Feed
        </h2>
        <div class="group-page-side-bar--follow-toggle">
          ${components.followButton}
        </div>
        ${components.feed}
      </section>
    </div>
  </div>
`;

export const renderErrorPage = (): RenderPageError => ({
  type: 'unavailable' as const,
  message: toHtmlFragment('We couldn\'t retrieve this information. Please try again.'),
});

export const renderPage = (group: Group) => (components: Components): Page => ({
  title: group.name,
  content: pipe(components, render, toHtmlFragment),
});
