import { toHtmlFragment } from '../../types/html-fragment.js';
import { HtmlPage, toHtmlPage } from '../html-page.js';

export const indexPage: HtmlPage = toHtmlPage({
  title: 'Style guide',
  content: toHtmlFragment(`
    <h1>Style guide</h1>
    <ul role="list">
      <li role="list-item">
        <a href="/style-guide/reference">Reference</a>
      </li> 
      <li role="list-item">
        <a href="/style-guide/shared-components">Shared components</a>
      </li> 
    </ul>
  `),
});
