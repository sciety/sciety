import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel } from './construct-view-model';
import { Dependencies } from './dependencies';
import { paramsCodec } from './params';
import { renderAsHtml } from './render-as-html';
import { constructErrorPageViewModel } from '../construct-error-page-view-model';
import { ConstructLoggedInPage } from '../construct-page';
import { decodePageParams } from '../decode-page-params';

export const saveArticleFormPage = (
  dependencies: Dependencies,
): ConstructLoggedInPage => (userId, input) => pipe(
  input,
  decodePageParams(dependencies.logger, paramsCodec),
  TE.fromEither,
  TE.chainW(constructViewModel(dependencies, userId)),
  TE.bimap(constructErrorPageViewModel, renderAsHtml),
);
