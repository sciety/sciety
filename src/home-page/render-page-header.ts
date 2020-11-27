import * as T from 'fp-ts/lib/Task';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type RenderPageHeader = T.Task<HtmlFragment>;

export default (): RenderPageHeader => (
  T.of(toHtmlFragment(`
    <header class="home-page-header">

      <h1>
        Welcome to Sciety
      </h1>

      <p>
        Where research is evaluated and curated by the communities you trust.<br><a href="/about">Learn more about the platform.</a>
      </p>

    </header>
  `))
);
