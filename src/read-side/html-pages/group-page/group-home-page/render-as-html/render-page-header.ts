import { renderGroupPageActions } from './render-group-page-actions';
import { HtmlFragment, toHtmlFragment } from '../../../../../types/html-fragment';
import { renderIdentityAndDescription } from '../../common-components/render-page-header';
import { PageHeaderViewModel } from '../view-model';

export const renderPageHeader = (viewmodel: PageHeaderViewModel): HtmlFragment => toHtmlFragment(`
  <header class="page-header">
    ${renderIdentityAndDescription(viewmodel)}
    ${renderGroupPageActions(viewmodel)}
  </header>
`);
