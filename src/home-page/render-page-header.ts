import * as T from 'fp-ts/Task';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type RenderPageHeader = T.Task<HtmlFragment>;

export const renderPageHeader = (): RenderPageHeader => (
  T.of(toHtmlFragment(`
    <header class="home-page-header">

      <h1>
        Welcome to Sciety
      </h1>

      <p>
        Where research is evaluated and curated by the groups you trust.<br><a href="/about">Learn more about the platform.</a>
      </p>

    </header>
  `))
);
