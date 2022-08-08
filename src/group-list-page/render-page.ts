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
    <figure>
      <a href="#" class="close"></a>
      <figcaption>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Donec felis enim, placerat id eleifend eu, semper vel sem.</figcaption>
    </figure>
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
