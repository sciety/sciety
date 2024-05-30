import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { formatValidationErrors } from 'io-ts-reporters';
import { constructViewModel } from './construct-view-model';
import { Dependencies } from './dependencies';
import { paramsCodec } from './params';
import { renderAsHtml } from './render-as-html';
import * as DE from '../../../../types/data-error';
import { ConstructLoggedInPage } from '../../construct-page';
import { renderErrorPage } from '../common-components/render-error-page';

export const page = (
  dependencies: Dependencies,
): ConstructLoggedInPage => (userId, input) => pipe(
  input,
  paramsCodec.decode,
  E.mapLeft((errors) => {
    dependencies.logger('warn', 'group-add-a-featured-list-form-page params codec failed', { errors: formatValidationErrors(errors) });
    return DE.notFound;
  }),
  E.chainW(constructViewModel(dependencies, userId)),
  E.bimap(renderErrorPage, renderAsHtml),
  TE.fromEither,
);
