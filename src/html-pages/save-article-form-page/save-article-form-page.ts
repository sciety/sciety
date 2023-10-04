import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { renderAsHtml } from './render-as-html';
import { constructViewModel } from './construct-view-model';
import * as DE from '../../types/data-error';
import { toHtmlFragment } from '../../types/html-fragment';
import { paramsCodec } from './params';
import { Dependencies } from './dependencies';
import { ConstructPage } from '../construct-page';

export const saveArticleFormPage = (
  dependencies: Dependencies,
): ConstructPage => (
  input,
) => pipe(
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
