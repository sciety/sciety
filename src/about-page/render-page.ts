import * as T from 'fp-ts/lib/Task';
import { Result } from 'true-myth';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type RenderPage = (filename: string) => Promise<Result<{
  title: string,
  content: HtmlFragment,
}, never>>;

export type GetHtml = (filename: string) => T.Task<string>;

export default (
  getHtml: GetHtml,
): RenderPage => async (filename) => Result.ok({
  title: 'About',
  content: toHtmlFragment(`
    <div class="about-page-wrapper">
      <header class="page-header">
        <h1>
          About Sciety
        </h1>
      </header>
      ${await getHtml(filename)()}
    </div>
  `),
});
