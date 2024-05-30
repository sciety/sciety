import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { formatValidationErrors } from 'io-ts-reporters';
import { constructViewModel } from './construct-view-model';
import { Dependencies } from './dependencies';
import { paramsCodec } from './params';
import { renderAsHtml } from './render-as-html';
import * as DE from '../../../types/data-error';
import { ConstructLoggedInPage } from '../construct-page';
import { renderErrorPage } from '../render-error-page';

export const saveArticleFormPage = (
  dependencies: Dependencies,
): ConstructLoggedInPage => (userId, input) => pipe(
  input,
  paramsCodec.decode,
  E.mapLeft((errors) => {
    dependencies.logger('warn', 'saveArticleFormPage params codec failed', { errors: formatValidationErrors(errors) });
    return DE.notFound;
  }),
  TE.fromEither,
  TE.chainW(constructViewModel(dependencies, userId)),
  TE.bimap(renderErrorPage, renderAsHtml),
);
