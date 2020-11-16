import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type RenderPageHeader = () => Promise<HtmlFragment>;

export default (): RenderPageHeader => (
  async () => toHtmlFragment(`
    <header class="home-page-header">

      <h1>
        Welcome to Sciety
      </h1>

      <p>
        Where research is evaluated and curated by the communities you trust.<br><a href="/about">Learn more about the platform.</a>
      </p>

    </header>
  `)
);
