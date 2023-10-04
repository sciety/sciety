import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { renderAsHtml } from './render-as-html';
import { constructViewModel } from './construct-view-model';
import * as DE from '../../types/data-error';
import { toHtmlFragment } from '../../types/html-fragment';
import { paramsCodec } from './params';
import { Dependencies } from './dependencies';

type SaveArticleFormPage = TE.TaskEither<RenderPageError, Page>;

export const saveArticleFormPage = (
  dependencies: Dependencies,
) => (
  input: Record<string, unknown>,
): SaveArticleFormPage => pipe(
  input,
  paramsCodec.decode,
  TE.fromEither,
  TE.chainW(constructViewModel(dependencies)),
  TE.bimap(
    () => ({
      type: DE.unavailable,
      message: toHtmlFragment('Missing information about which article to save.'),
    }),
    renderAsHtml,
  ),
);
