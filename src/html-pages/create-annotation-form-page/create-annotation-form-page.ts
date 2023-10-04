import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import { pipe } from 'fp-ts/function';
import { HtmlPage } from '../../types/html-page';
import { RenderPageError } from '../../types/render-page-error';
import { renderPage } from './render-page';
import { Dependencies, constructViewModel } from './construct-view-model';
import { toErrorPage } from './to-error-page';
import { DoiFromString } from '../../types/codecs/DoiFromString';
import { listIdCodec } from '../../types/list-id';

export const paramsCodec = t.type({
  articleId: DoiFromString,
  listId: listIdCodec,
});

type Params = t.TypeOf<typeof paramsCodec>;

type CreateAnnotationFormPage = (dependencies: Dependencies)
=> (params: Params)
=> TE.TaskEither<RenderPageError, HtmlPage>;

export const createAnnotationFormPage: CreateAnnotationFormPage = (dependencies) => (params) => pipe(
  params,
  ({ articleId, listId }) => constructViewModel(articleId, listId, dependencies),
  TE.bimap(
    toErrorPage,
    (viewModel) => ({
      title: 'Create an annotation',
      content: renderPage(viewModel),
    }),
  ),
);
