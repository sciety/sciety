import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';

// ts-unused-exports:disable-next-line
export const wrapperForTopSpace = (wrapped: HtmlFragment): HtmlFragment => toHtmlFragment(`
  <div class="group-page-tab-panel-content">
    ${wrapped}
  </div>
`);
