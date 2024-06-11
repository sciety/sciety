import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { formatValidationErrors } from 'io-ts-reporters';
import { constructViewModel } from './construct-view-model/construct-view-model';
import { Dependencies } from './construct-view-model/dependencies';
import { paramsCodec } from './construct-view-model/params';
import { renderAsHtml } from './render-as-html/render-as-html';
import * as DE from '../../../../types/data-error';
import { constructErrorPageViewModel } from '../../construct-error-page-view-model';
import { ConstructLoggedInPage } from '../../construct-page';

export const page = (
  dependencies: Dependencies,
): ConstructLoggedInPage => (userId, input) => pipe(
  input,
  paramsCodec.decode,
  E.mapLeft((errors) => {
    dependencies.logger('warn', 'group-management-page params codec failed', { errors: formatValidationErrors(errors) });
    return DE.notFound;
  }),
  E.chainW(constructViewModel(dependencies, userId)),
  E.bimap(constructErrorPageViewModel, renderAsHtml),
  TE.fromEither,
);
