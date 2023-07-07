import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel, Params } from './construct-view-model';
import { renderAsHtml, toErrorPage } from './render-as-html';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { Dependencies } from './construct-view-model/dependencies';

type ArticlePage = (dependencies: Dependencies) => (params: Params) => TE.TaskEither<RenderPageError, Page>;

export const articlePage: ArticlePage = (dependencies) => (params) => pipe(
  params,
  constructViewModel(dependencies),
  TE.bimap(toErrorPage, renderAsHtml),
);
