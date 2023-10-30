import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as DE from '../../types/data-error';
import { constructViewModel } from './construct-view-model';
import { renderAsHtml, toErrorPage } from './render-as-html';
import { HtmlPage } from '../../types/html-page';
import { RenderPageError } from '../../types/render-page-error';
import { Dependencies } from './construct-view-model/dependencies';
import { articlePageParams } from './construct-view-model/construct-view-model';

type ArticlePage = (dependencies: Dependencies) => (params: unknown) => TE.TaskEither<RenderPageError, HtmlPage>;

export const articlePage: ArticlePage = (dependencies) => (params) => pipe(
  params,
  articlePageParams.decode,
  TE.fromEither,
  TE.mapLeft(() => DE.notFound),
  TE.chain(constructViewModel(dependencies)),
  TE.bimap(toErrorPage, renderAsHtml),
);
