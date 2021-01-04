import * as T from 'fp-ts/lib/Task';
import { flow, pipe } from 'fp-ts/lib/function';
import { Result } from 'true-myth';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

export type RenderPage = (filename: string) => T.Task<Result<{
  title: string,
  content: HtmlFragment,
}, never>>;

type GetHtml = (filename: string) => T.Task<string>;

const pageWrapper = (html: string): string => `
  <div class="about-page-wrapper">
    <header class="page-header">
      <h1>
        Community and Outreach Manager
      </h1>
    </header>
    ${html}
  </div>
`;

export default (getHtml: GetHtml): RenderPage => flow(
  getHtml,
  T.map((html) => Result.ok({
    title: 'Community and Outreach Manager',
    content: pipe(html, pageWrapper, toHtmlFragment),
  })),
);
