import { pipe } from 'fp-ts/function';
import * as DE from '../types/data-error';
import { Group } from '../types/group';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

type Components = {
  header: HtmlFragment,
  evaluatedArticlesList: HtmlFragment,
};

const render = (components: Components) => `
  ${components.header}
  <section class="evaluated-articles">
    ${components.evaluatedArticlesList}
  </section>
`;

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

export const renderPage = (group: Group) => (components: Components): Page => ({
  title: group.name,
  content: pipe(components, render, toHtmlFragment),
});
