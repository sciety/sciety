import { pipe } from 'fp-ts/function';
import * as DE from '../../types/data-error';
import { Group } from '../../types/group';
import { toHtmlFragment } from '../../types/html-fragment';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { ViewModel } from './view-model';

const render = (viewmodel: ViewModel) => `
  ${viewmodel.header}
  <div class="group-page-follow-toggle">
    ${viewmodel.followButton}
  </div>
  ${viewmodel.content}
`;

export const renderErrorPage = (): RenderPageError => ({
  type: DE.unavailable,
  message: toHtmlFragment('We couldn\'t retrieve this information. Please try again.'),
});

export const renderPage = (group: Group) => (viewmodel: ViewModel): Page => ({
  title: group.name,
  content: pipe(viewmodel, render, toHtmlFragment),
});
