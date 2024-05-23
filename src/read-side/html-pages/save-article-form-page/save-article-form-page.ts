import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { formatValidationErrors } from 'io-ts-reporters';
import { constructViewModel } from './construct-view-model';
import { Dependencies } from './dependencies';
import { paramsCodec } from './params';
import { renderAsHtml } from './render-as-html';
import { ConstructPage } from '../construct-page';
import { toUnavailable } from '../create-page-from-params';

export const saveArticleFormPage = (
  dependencies: Dependencies,
): ConstructPage => (input) => pipe(
  input,
  paramsCodec.decode,
  E.mapLeft((errors) => {
    dependencies.logger('warn', 'saveArticleFormPage params codec failed', { errors: formatValidationErrors(errors) });
    return errors;
  }),
  TE.fromEither,
  TE.chainW(constructViewModel(dependencies)),
  TE.bimap(
    toUnavailable,
    renderAsHtml,
  ),
);
