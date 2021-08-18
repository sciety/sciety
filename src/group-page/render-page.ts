import { pipe } from 'fp-ts/function';
import * as DE from '../types/data-error';
import { Group } from '../types/group';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

type Components = {
  header: HtmlFragment,
  followButton: HtmlFragment,
  content: HtmlFragment,
};

const render = (components: Components) => `
  <div class="page-content__background">
    <div class="sciety-grid sciety-grid--one-column">
      ${components.header}
      <div class="group-page-follow-toggle">
        ${components.followButton}
      </div>
      ${components.content}
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
