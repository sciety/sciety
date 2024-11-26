import { htmlEscape } from 'escape-goat';
import { renderGroupPageActions } from './render-group-page-actions';
import { HtmlFragment, toHtmlFragment } from '../../../../../types/html-fragment';
import { renderPageHeaderIdentity } from '../../common-components/render-page-header';
import { PageHeaderViewModel } from '../view-model';

export const renderPageHeader = (viewmodel: PageHeaderViewModel): HtmlFragment => toHtmlFragment(`
  <header class="page-header">
    <div class="page-header__identity">
      ${renderPageHeaderIdentity(viewmodel)}
    </div>
    <p class="group-page-short-description">
      ${htmlEscape(viewmodel.group.shortDescription)}
    </p>
    ${renderGroupPageActions(viewmodel)}
  </header>
`);
