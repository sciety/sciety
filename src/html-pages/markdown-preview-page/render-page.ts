import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

export const renderPage = (): HtmlFragment => toHtmlFragment(
  `
  <header class="page-header">
    <h1>
      Preview your Markdown content
    </h1>
  </header>
  <form class="standard-form" style="margin-bottom: 3rem">
    <label for="markdown" class="standard-form__sub_heading">Your Markdown</label>
    <textarea id="markdown" rows=10></textarea>
  </form>
  <h2>How it appears on Sciety</h2>
  <hr>
  <div id="rendered" class="activity-feed__item__body"></div>
  <hr>

  <script src="/static/markdown-preview.js"></script>
`,
);
