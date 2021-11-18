import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { articlesList } from './articlesList';
import { renderComponent } from '../list-page/header/render-component';
import { renderErrorPage } from '../list-page/render-page';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

const header = {
  name: 'Featured articles',
  description: 'Articles that have been identified as high-impact by NCRC editors.',
  ownerName: 'NCRC',
  ownerHref: '/groups/ncrc',
  ownerAvatarPath: '/static/groups/ncrc--62f9b0d0-8d43-4766-a52a-ce02af61bc6a.jpg',
  articleCount: 0,
  lastUpdated: O.some(new Date('2021-11-18T11:33:00Z')),
};

type Components = {
  header: HtmlFragment,
  articlesList: HtmlFragment,
};

const render = (components: Components) => toHtmlFragment(`
  ${components.header}
  <section class="evaluated-articles">
    ${components.articlesList}
  </section>
`);

export const page = (): TE.TaskEither<RenderPageError, Page> => pipe(
  {
    header: pipe(
      header,
      renderComponent,
      TE.right,
    ),
    articlesList: articlesList(1),
  },
  sequenceS(TE.ApplyPar),
  TE.map(render),
  TE.bimap(
    renderErrorPage,
    (content) => ({
      title: 'Featured articles',
      content,
    }),
  ),
);
