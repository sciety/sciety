import { pipe } from 'fp-ts/function';
import * as DE from '../types/data-error';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

type Components = {
  title: string,
  header: HtmlFragment,
  content: HtmlFragment,
  supplementary?: HtmlFragment,
};

type Render = (components: Components) => HtmlFragment;

const render: Render = ({ header, content, supplementary = toHtmlFragment('') }) => toHtmlFragment(`
  ${header}
  <ul>
  <li><a href="#example1">Open example #1</a></li>
  </ul>

  <div class="lightbox" id="example1">
    <a href="#" class="close"></a>
    <form>
      <label>
        List name
        <input>
      </label>
      <label>
        Description
        <textarea></textarea>
      </label>
      <a href="#">Cancel</a>
      <button type="submit">Save</button>
    </form>
  </div>

  <section>
    ${content}
  </section>
  ${supplementary}
`);

export const renderErrorPage = (e: DE.DataError): RenderPageError => pipe(
  e,
  DE.fold({
    notFound: () => 'We couldn\'t find this information.',
    unavailable: () => 'We couldn\'t retrieve this information. Please try again.',
  }),
  toHtmlFragment,
  (message) => ({
    type: e,
    message,
  }),
);

export const renderPage = (components: Components): Page => ({
  title: components.title,
  content: pipe(components, render, toHtmlFragment),
});
