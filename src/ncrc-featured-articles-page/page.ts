import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { articlesList, Ports } from './articles-list/articlesList';
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
  articleCount: 1,
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

export const paramsCodec = t.type({
  page: tt.withFallback(tt.NumberFromString, 1),
});

type Params = t.TypeOf<typeof paramsCodec>;

const listId = 'cbd478fe-3ff7-4125-ac9f-c94ff52ae0f7';

export const page = (ports: Ports) => (params: Params): TE.TaskEither<RenderPageError, Page> => pipe(
  {
    header: pipe(
      header,
      renderComponent,
      TE.right,
    ),
    articlesList: articlesList(ports, listId, params.page),
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
