import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type RenderErrorPage = (message: HtmlFragment) => HtmlFragment;

export const renderErrorPage: RenderErrorPage = (message) => toHtmlFragment(`
  <div class="error-page">
    <h1>Oops!</h1>
    <p>
      ${message}
    </p>   
  </div>
`);
